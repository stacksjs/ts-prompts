# CLI Framework

clapp provides a powerful framework for building command-line interfaces with clean, intuitive syntax.

## Core Features

- **Elegant API**: Simple, chainable API for creating commands and options
- **Type Safety**: Built with TypeScript for type checking and autocompletion
- **Subcommands**: Create nested command hierarchies
- **Input Validation**: Validate command arguments and options
- **Help Generation**: Automatic generation of help text and usage information
- **Error Handling**: Clean error reporting and handling

## Creating a CLI Application

The foundation of any clapp application is the CLI object:

```ts
import { cli } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
  description: 'My awesome CLI application',
})

// ... add commands here

app.run()
```

## Command Definition

Commands are the primary interface for users to interact with your application:

```ts
import { command } from '@stacksjs/clapp'

// Basic command
command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello, world!')
  })

// Command with arguments
command('greet')
  .description('Greet a user')
  .argument('<name>', 'Name of the person to greet')
  .action((name) => {
    console.log(`Hello, ${name}!`)
  })
```

## Command Options

Customize command behavior with options:

```ts
command('build')
  .description('Build the project')
  .option('-m, --mode <mode>', 'Build mode', 'production')
  .option('-w, --watch', 'Watch for changes')
  .option('-o, --output <dir>', 'Output directory')
  .action((options) => {
    console.log(`Building in ${options.mode} mode`)
    if (options.watch)
      console.log('Watching for changes...')
    if (options.output)
      console.log(`Output directory: ${options.output}`)
  })
```

## Subcommands

Organize related commands into hierarchies:

```ts
// Parent command
const db = command('db')
  .description('Database operations')

// Child commands
db.command('migrate')
  .description('Run database migrations')
  .action(() => {
    console.log('Running migrations...')
  })

db.command('seed')
  .description('Seed database with data')
  .action(() => {
    console.log('Seeding database...')
  })
```

## Help and Documentation

clapp automatically generates help text for your commands:

```ts
// Default help command is available
// $ mycli --help
// $ mycli <command> --help

// You can also customize help text
command('hello')
  .description('Say hello')
  .help('Examples:\n  $ mycli hello\n  $ mycli hello --uppercase')
```

## Error Handling

Handle errors gracefully with built-in error utilities:

```ts
import { command, error } from '@stacksjs/clapp'

command('read')
  .argument('<file>', 'File to read')
  .action((file) => {
    try {
      // Attempt to read file
      const contents = readFileSync(file, 'utf8')
      console.log(contents)
    }
    catch (err) {
      // Handle file not found
      error(`Could not read file: ${file}`, {
        exitCode: 1,
        suggestions: [
          'Check that the file exists',
          'Ensure you have permission to read the file',
        ],
      })
    }
  })
```

## Global Options

Define options that apply to all commands:

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

// Add a global verbosity option
app.option('-v, --verbose', 'Enable verbose output')

// Commands can access global options
command('process')
  .action((options) => {
    if (options.verbose) {
      console.log('Verbose mode enabled')
    }
    // Process command...
  })
```

## Lifecycle Hooks

Register hooks that run at different points in the command lifecycle:

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

// Before any command runs
app.beforeRun(() => {
  console.log('Starting CLI...')
})

// After all commands complete
app.afterRun(() => {
  console.log('CLI execution complete')
})

command('hello')
  .action(() => {
    console.log('Hello, world!')
  })
```

## Complete Example

Here's a more complete example showing various features:

```ts
import { cli, command } from '@stacksjs/clapp'

// Create the CLI application
const app = cli({
  name: 'mycli',
  version: '1.0.0',
  description: 'Example CLI application',
})

// Global options
app.option('--no-color', 'Disable colored output')
app.option('-v, --verbose', 'Enable verbose logging')

// Base commands
command('hello')
  .description('Say hello')
  .argument('[name]', 'Name to greet', 'world')
  .option('-u, --uppercase', 'Convert to uppercase')
  .action((name, options) => {
    let message = `Hello, ${name}!`
    if (options.uppercase) {
      message = message.toUpperCase()
    }
    console.log(message)
  })

// Command with subcommands
const config = command('config')
  .description('Manage configuration')

config.command('get')
  .argument('<key>', 'Config key to retrieve')
  .action((key) => {
    console.log(`Getting config for: ${key}`)
  })

config.command('set')
  .argument('<key>', 'Config key to set')
  .argument('<value>', 'Value to set')
  .action((key, value) => {
    console.log(`Setting ${key} to ${value}`)
  })

// Run the application
app.run()
```

For more detailed information, check the [Commands](../commands) and [API Reference](../api/cli) sections.
