# Option API Reference

The `option` module provides functionality for defining and managing command-line options.

## Creating Options

### createOption(flags, description, defaultValue?)

Creates a reusable option that can be added to multiple commands.

```ts
import { createOption } from '@stacksjs/clapp'

const verboseOption = createOption('-v, --verbose', 'Enable verbose output')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `flags` | `string` | The option flags | Required |
| `description` | `string` | The option description | `''` |
| `defaultValue` | `any` | Default value for the option | `undefined` |

#### Returns

Returns an Option instance that can be added to commands.

## Option Properties

### name

Gets the long name of the option (without dashes).

```ts
const option = createOption('-v, --verbose', 'Enable verbose output')
console.log(option.name) // 'verbose'
```

### shortName

Gets the short name of the option (without dash).

```ts
const option = createOption('-v, --verbose', 'Enable verbose output')
console.log(option.shortName) // 'v'
```

### description

Gets the description of the option.

```ts
const option = createOption('-v, --verbose', 'Enable verbose output')
console.log(option.description) // 'Enable verbose output'
```

### defaultValue

Gets the default value of the option.

```ts
const option = createOption('-m, --mode <mode>', 'Build mode', 'development')
console.log(option.defaultValue) // 'development'
```

### required

Indicates whether the option requires a value.

```ts
const option = createOption('-o, --output <dir>', 'Output directory')
console.log(option.required) // true
```

### optional

Indicates whether the option accepts an optional value.

```ts
const option = createOption('-t, --tag [value]', 'Tag value')
console.log(option.optional) // true
```

### negatable

Indicates whether the option is negatable (--no-prefix).

```ts
const option = createOption('--color/--no-color', 'Enable color output')
console.log(option.negatable) // true
```

### choices

Gets the allowed values for the option (if defined).

```ts
const option = createOption('-m, --mode <mode>', 'Build mode', {
  choices: ['development', 'production', 'test'],
  default: 'development',
})
console.log(option.choices) // ['development', 'production', 'test']
```

## Option Instance Methods

### validate(value)

Validates a value against the option's constraints.

```ts
const option = createOption('-p, --port <port>', 'Port number', {
  choices: [80, 443, 3000, 8080],
})

console.log(option.validate(80)) // true
console.log(option.validate(8000)) // Error: Invalid value for option 'port'
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `value` | `any` | The value to validate | Required |

#### Returns

Returns `true` if the value is valid, or throws an error if invalid.

### coerce(value)

Coerces a value to the appropriate type for the option.

```ts
const option = createOption('-p, --port <port>', 'Port number', {
  coerce: value => Number.parseInt(value, 10),
})

console.log(option.coerce('8080')) // 8080 (number)
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `value` | `any` | The value to coerce | Required |

#### Returns

Returns the coerced value.

## Advanced Option Creation

### Option Configuration Object

You can use a configuration object for more advanced option settings:

```ts
import { createOption } from '@stacksjs/clapp'

const modeOption = createOption('-m, --mode <mode>', 'Build mode', {
  // Set default value
  default: 'development',

  // Restrict to specific values
  choices: ['development', 'production', 'test'],

  // Convert to appropriate type
  coerce: value => value.toLowerCase(),

  // Custom validation
  validate: (value) => {
    if (!['development', 'production', 'test'].includes(value))
      return `Mode must be one of: development, production, test`
    return true
  },

  // Option dependency (requires --env option to be set)
  dependsOn: ['env'],

  // Conflict with other options (can't use with --quick option)
  conflicts: ['quick'],
})
```

### Configuration Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `default` | `any` | Default value for the option | `undefined` |
| `choices` | `any[]` | Allowed values for the option | `undefined` |
| `coerce` | `Function` | Function to convert the option value | `undefined` |
| `validate` | `Function` | Function to validate the option value | `undefined` |
| `dependsOn` | `string[]` | Options that must be specified with this option | `[]` |
| `conflicts` | `string[]` | Options that cannot be used with this option | `[]` |

## Option Types

clapp automatically determines option types based on the flags and configuration:

### Boolean Options

Options without a value placeholder are boolean:

```ts
// --verbose (true if present, false if not)
createOption('-v, --verbose', 'Enable verbose output')

// --color/--no-color (negatable boolean)
createOption('--color/--no-color', 'Enable color output', true)
```

### String Options

Options with a value placeholder are strings by default:

```ts
// --output <dir>
createOption('-o, --output <dir>', 'Output directory')
```

### Number Options

You can convert string option values to numbers using `coerce`:

```ts
createOption('-p, --port <port>', 'Port number', {
  coerce: value => Number.parseInt(value, 10),
  validate: value => value >= 0 && value <= 65535,
})
```

### Array Options

You can collect multiple option values into an array:

```ts
createOption('-i, --include <file>', 'Files to include', {
  array: true,
})

// Usage: --include file1.js --include file2.js
// Result: { include: ['file1.js', 'file2.js'] }
```

## Usage Examples

### Basic Options

```ts
import { command, createOption } from '@stacksjs/clapp'

// Boolean option
command('build')
  .option('-w, --watch', 'Watch for changes')

// String option
command('output')
  .option('-f, --format <type>', 'Output format', 'json')

// Option with choices
command('deploy')
  .option('-e, --env <environment>', 'Deployment environment', {
    choices: ['dev', 'staging', 'prod'],
    default: 'dev',
  })
```

### Reusable Options

```ts
import { command, createOption } from '@stacksjs/clapp'

// Create common options
const verboseOption = createOption('-v, --verbose', 'Enable verbose output')
const formatOption = createOption('-f, --format <type>', 'Output format', 'json')

// Apply to multiple commands
command('build')
  .addOption(verboseOption)
  .addOption(formatOption)

command('deploy')
  .addOption(verboseOption)
  .addOption(formatOption)
```

### Negatable Options

```ts
import { command } from '@stacksjs/clapp'

command('build')
  .option('--color/--no-color', 'Enable colorized output', true)
  .action((options) => {
    console.log(`Color output: ${options.color ? 'enabled' : 'disabled'}`)
  })
```

### Options with Validation

```ts
import { command } from '@stacksjs/clapp'

command('serve')
  .option('-p, --port <port>', 'Port to listen on', {
    default: 3000,
    coerce: value => Number.parseInt(value, 10),
    validate: (value) => {
      if (isNaN(value) || value < 1 || value > 65535)
        return 'Port must be a number between 1 and 65535'
      return true
    },
  })
  .action((options) => {
    console.log(`Starting server on port ${options.port}`)
  })
```

### Options with Dependencies

```ts
import { command } from '@stacksjs/clapp'

command('deploy')
  .option('-e, --env <environment>', 'Deployment environment')
  .option('-c, --config <path>', 'Config file', {
    dependsOn: ['env'],
  })
  .action((options) => {
    if (options.config && !options.env) {
      console.error('Error: --config requires --env to be specified')
      return
    }

    console.log(`Deploying to ${options.env} with config ${options.config}`)
  })
```

### Options with Conflicts

```ts
import { command } from '@stacksjs/clapp'

command('build')
  .option('-q, --quick', 'Quick build (no optimizations)')
  .option('-o, --optimize', 'Enable optimizations', {
    conflicts: ['quick'],
  })
  .action((options) => {
    if (options.quick && options.optimize) {
      console.error('Error: Cannot use --quick and --optimize together')
      return
    }

    if (options.quick) {
      console.log('Performing quick build...')
    }
    else if (options.optimize) {
      console.log('Performing optimized build...')
    }
    else {
      console.log('Performing standard build...')
    }
  })
```
