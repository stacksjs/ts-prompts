# Command API Reference

The `command` module provides a chainable API for defining CLI commands and their behavior.

## Creating Commands

### command(name)

Creates a new command with the given name.

```ts
import { command } from '@stacksjs/clapp'

const helloCommand = command('hello')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `name` | `string` | The name of the command | Required |

#### Returns

Returns a new Command instance.

## Command Instance Methods

### description(text)

Sets the description for the command.

```ts
command('hello')
  .description('Say hello to someone')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `text` | `string` | The description text | Required |

#### Returns

Returns the Command instance for chaining.

### argument(name, description, defaultValue?)

Adds an argument to the command.

```ts
command('greet')
  .argument('<name>', 'Name of the person to greet')
  .argument('[title]', 'Optional title', 'Mr./Ms.')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `name` | `string` | The argument name with format | Required |
| `description` | `string` | The argument description | `''` |
| `defaultValue` | `any` | Default value for optional arguments | `undefined` |

#### Format

- `<name>`: Required argument
- `[name]`: Optional argument
- `<name:type>`: Required argument with type (number, string, boolean)
- `[name:type]`: Optional argument with type
- `<...name>`: Required variadic argument (must be last)
- `[...name]`: Optional variadic argument (must be last)

#### Returns

Returns the Command instance for chaining.

### option(flags, description, defaultValue?)

Adds an option to the command.

```ts
command('build')
  .option('-w, --watch', 'Watch for changes')
  .option('-o, --output <dir>', 'Output directory')
  .option('-m, --mode <mode>', 'Build mode', 'development')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `flags` | `string` | The option flags | Required |
| `description` | `string` | The option description | `''` |
| `defaultValue` | `any` | Default value for the option | `undefined` |

#### Flags Format

- `-s, --short`: Boolean option (no value)
- `-n, --name <value>`: Option with required value
- `-t, --title [value]`: Option with optional value
- `--no-color`: Negatable boolean option

#### Returns

Returns the Command instance for chaining.

### action(fn)

Sets the action to execute when the command is run.

```ts
command('hello')
  .argument('<name>', 'Name to greet')
  .action((name, options) => {
    console.log(`Hello, ${name}!`)
  })
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `fn` | `Function` | The action function | Required |

The action function receives all defined arguments, followed by an options object containing all options.

#### Returns

Returns the Command instance for chaining.

### alias(name)

Adds an alias for the command.

```ts
command('install')
  .alias('i')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `name` | `string` | The alias name | Required |

#### Returns

Returns the Command instance for chaining.

### help(options)

Customizes the help output for the command.

```ts
command('build')
  .help({
    usage: 'mycli build [options]',
    examples: [
      'mycli build',
      'mycli build --watch',
      'mycli build --mode production',
    ],
  })
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `options` | `object` or `string` | Help configuration | Required |

If a string is provided, it will be used as the help text. If an object is provided, it should have the following properties:

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `usage` | `string` | Custom usage text | Command usage format |
| `examples` | `string[]` | Example usage patterns | `[]` |
| `includeOptions` | `boolean` | Whether to include options in help | `true` |
| `includeArguments` | `boolean` | Whether to include arguments in help | `true` |

#### Returns

Returns the Command instance for chaining.

### command(name)

Creates a subcommand for this command.

```ts
const db = command('db')
  .description('Database operations')

db.command('migrate')
  .description('Run database migrations')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `name` | `string` | The name of the subcommand | Required |

#### Returns

Returns a new Command instance representing the subcommand.

### hidden()

Marks the command as hidden (won't show up in help).

```ts
command('secret')
  .hidden()
```

#### Returns

Returns the Command instance for chaining.

### addOption(option)

Adds a pre-configured option to the command.

```ts
import { command, createOption } from '@stacksjs/clapp'

// Create a reusable option
const verboseOption = createOption('-v, --verbose', 'Enable verbose output')

// Add it to multiple commands
command('build')
  .addOption(verboseOption)

command('deploy')
  .addOption(verboseOption)
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `option` | `Option` | The option to add | Required |

#### Returns

Returns the Command instance for chaining.

### middleware(fns)

Adds middleware functions to run before the command action.

```ts
command('deploy')
  .middleware([
    async (next) => {
      console.log('Checking authentication...')
      await next()
    },
    async (next) => {
      console.log('Starting deployment...')
      await next()
      console.log('Deployment complete!')
    },
  ])
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `fns` | `Function[]` | Array of middleware functions | Required |

Each middleware function receives a `next` function that should be called to continue execution.

#### Returns

Returns the Command instance for chaining.

### beforeRun(fn)

Registers a function to run before the command is executed.

```ts
command('build')
  .beforeRun(() => {
    console.log('Preparing to build...')
  })
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `fn` | `Function` | The function to run | Required |

#### Returns

Returns the Command instance for chaining.

### afterRun(fn)

Registers a function to run after the command is executed.

```ts
command('build')
  .afterRun(() => {
    console.log('Build completed!')
  })
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `fn` | `Function` | The function to run | Required |

#### Returns

Returns the Command instance for chaining.

## Command Properties

### name

Gets the name of the command.

```ts
const cmd = command('hello')
console.log(cmd.name) // 'hello'
```

### arguments

Gets the defined arguments for the command.

```ts
const cmd = command('hello')
  .argument('<name>', 'Name to greet')

console.log(cmd.arguments) // [Argument]
```

### options

Gets the defined options for the command.

```ts
const cmd = command('build')
  .option('-w, --watch', 'Watch for changes')

console.log(cmd.options) // [Option]
```

### commands

Gets the subcommands of this command.

```ts
const db = command('db')
db.command('migrate')

console.log(db.commands) // [Command]
```

## Usage Examples

### Basic Command

```ts
import { command } from '@stacksjs/clapp'

command('hello')
  .description('Say hello to someone')
  .action(() => {
    console.log('Hello, world!')
  })
```

### Command with Arguments

```ts
command('greet')
  .description('Greet a user')
  .argument('<name>', 'Name of the person to greet')
  .argument('[title]', 'Optional title', 'Mr./Ms.')
  .action((name, title, options) => {
    console.log(`Hello, ${title} ${name}!`)
  })
```

### Command with Options

```ts
command('build')
  .description('Build the project')
  .option('-w, --watch', 'Watch for changes')
  .option('-m, --mode <mode>', 'Build mode', 'development')
  .option('-o, --output <dir>', 'Output directory')
  .action((options) => {
    console.log(`Building in ${options.mode} mode`)
    if (options.watch)
      console.log('Watching for changes...')
    if (options.output)
      console.log(`Output directory: ${options.output}`)
  })
```

### Command with Subcommands

```ts
const db = command('db')
  .description('Database operations')

db.command('migrate')
  .description('Run database migrations')
  .option('--dry-run', 'Show migrations without executing')
  .action((options) => {
    if (options.dryRun) {
      console.log('Dry run: migrations would be executed')
    }
    else {
      console.log('Running migrations...')
    }
  })

db.command('seed')
  .description('Seed database with data')
  .action(() => {
    console.log('Seeding database...')
  })
```

### Command with Lifecycle Hooks

```ts
command('deploy')
  .description('Deploy application')
  .beforeRun(() => {
    console.log('Preparing deployment...')
  })
  .action(() => {
    console.log('Deploying application...')
  })
  .afterRun(() => {
    console.log('Deployment complete!')
  })
```

### Command with Custom Help

```ts
import { command, style } from '@stacksjs/clapp'

command('build')
  .description('Build the project')
  .option('-w, --watch', 'Watch for changes')
  .option('-m, --mode <mode>', 'Build mode', 'development')
  .help({
    usage: 'mycli build [options]',
    examples: [
      'mycli build',
      'mycli build --watch',
      'mycli build --mode production',
    ],
  })
  .action((options) => {
    console.log(`Building in ${options.mode} mode`)
  })
```
