# CLI API Reference

The `cli` module is the foundation of the clapp framework, providing methods for creating and configuring CLI applications.

## Creating a CLI Application

### cli(options)

Creates a new CLI application instance.

```ts
import { cli } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
  description: 'My CLI application',
})
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `name` | `string` | The name of the CLI application | Required |
| `version` | `string` | The version of the CLI application | Required |
| `description` | `string` | A description of the CLI application | `''` |
| `bin` | `string` | The binary name to use when the CLI is installed | Same as `name` |
| `strictCommands` | `boolean` | Whether to error for unknown commands | `false` |
| `strictOptions` | `boolean` | Whether to error for unknown options | `false` |
| `autoHelp` | `boolean` | Whether to automatically show help for unknown commands | `true` |
| `autoVersion` | `boolean` | Whether to automatically add a version command | `true` |
| `helpCommand` | `boolean` | Whether to add a help command | `true` |
| `exitProcess` | `boolean` | Whether to exit the process when a command fails | `true` |
| `noDefaultHelp` | `boolean` | Whether to disable the default help output | `false` |

## CLI Instance Methods

### run(argv?)

Runs the CLI application with the given arguments.

```ts
// Parse process.argv
app.run()

// Parse custom arguments
app.run(['--version'])
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `argv` | `string[]` | The arguments to parse | `process.argv.slice(2)` |

### option(flags, description, defaultValue?)

Adds a global option to the CLI application.

```ts
app.option('-v, --verbose', 'Enable verbose output')
app.option('--config <path>', 'Path to config file', './config.json')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `flags` | `string` | The option flags | Required |
| `description` | `string` | A description of the option | `''` |
| `defaultValue` | `any` | The default value for the option | `undefined` |

#### Returns

Returns the CLI instance for chaining.

### beforeRun(fn)

Registers a function to run before any command is executed.

```ts
app.beforeRun(() => {
  console.log('Starting CLI...')
})
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `fn` | `Function` | The function to run | Required |

#### Returns

Returns the CLI instance for chaining.

### afterRun(fn)

Registers a function to run after all commands have executed.

```ts
app.afterRun(() => {
  console.log('CLI execution complete')
})
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `fn` | `Function` | The function to run | Required |

#### Returns

Returns the CLI instance for chaining.

### version(version)

Sets the version of the CLI application.

```ts
app.version('1.0.0')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `version` | `string` | The version string | Required |

#### Returns

Returns the CLI instance for chaining.

### help(options)

Customizes the help output for the CLI application.

```ts
app.help({
  header: 'Custom header',
  description: 'Custom description',
  examples: [
    'mycli command --option value',
    'mycli other-command',
  ],
  footer: 'For more information, visit our website.',
})
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `options` | `object` | Help configuration options | Required |

#### Options Object

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `header` | `string` | Text to display at the top of the help output | CLI name |
| `description` | `string` | The description to display | CLI description |
| `examples` | `string[]` | Example usage patterns | `[]` |
| `footer` | `string` | Text to display at the bottom of the help output | `''` |
| `includeOptions` | `boolean` | Whether to include options in the help output | `true` |
| `includeCommands` | `boolean` | Whether to include commands in the help output | `true` |

#### Returns

Returns the CLI instance for chaining.

## CLI Class Properties

### name

Gets the name of the CLI application.

```ts
console.log(app.name) // 'mycli'
```

### version

Gets the version of the CLI application.

```ts
console.log(app.version) // '1.0.0'
```

### description

Gets the description of the CLI application.

```ts
console.log(app.description) // 'My CLI application'
```

### commands

Gets the registered commands.

```ts
console.log(app.commands) // [Command, Command, ...]
```

### options

Gets the registered global options.

```ts
console.log(app.options) // [Option, Option, ...]
```

## Usage Examples

### Basic CLI

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
  description: 'My CLI application',
})

command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello, world!')
  })

app.run()
```

### CLI with Global Options

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
})

// Add global options
app.option('-v, --verbose', 'Enable verbose output')
app.option('--no-color', 'Disable colored output')

command('build')
  .description('Build the project')
  .action((options) => {
    if (options.verbose) {
      console.log('Verbose mode enabled')
    }

    console.log(`Color output: ${options.color ? 'enabled' : 'disabled'}`)
    console.log('Building project...')
  })

app.run()
```

### CLI with Lifecycle Hooks

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
})

// Add lifecycle hooks
app.beforeRun(() => {
  console.log('Starting CLI...')
})

app.afterRun(() => {
  console.log('CLI execution complete')
})

command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello, world!')
  })

app.run()
```

### CLI with Custom Help

```ts
import { cli, command, style } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
})

// Customize help output
app.help({
  header: style.bold.blue('MYCLI HELP'),
  description: 'A powerful CLI application',
  examples: [
    'mycli hello',
    'mycli build --watch',
    'mycli deploy --env production',
  ],
  footer: style.dim('For more information, visit https://example.com'),
})

command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello, world!')
  })

app.run()
```
