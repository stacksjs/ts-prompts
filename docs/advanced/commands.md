# Creating Commands

This guide covers advanced techniques for creating and managing commands in your clapp applications.

## Command Architecture

Understanding the architecture behind clapp commands will help you build more sophisticated CLI applications.

### Command Lifecycle

Each command goes through a lifecycle:

1. **Registration**: Command is defined and registered with the CLI
2. **Parsing**: Command arguments and options are parsed
3. **Validation**: Inputs are validated against defined rules
4. **Execution**: Command action is executed with provided inputs
5. **Completion**: Command completes and returns results

## Advanced Arguments

### Variadic Arguments

Collect multiple arguments with variadic parameters:

```ts
command('install')
  .description('Install packages')
  .argument('<...packages>', 'Packages to install')
  .action((packages) => {
    console.log(`Installing packages: ${packages.join(', ')}`)
  })
```

### Typed Arguments

Define argument types for automatic conversion and validation:

```ts
command('launch')
  .description('Launch application')
  .argument('<port:number>', 'Port to listen on')
  .argument('[hostname:string]', 'Hostname', 'localhost')
  .action((port, hostname) => {
    // port is automatically converted to a number
    console.log(`Launching on ${hostname}:${port}`)
  })
```

## Advanced Options

### Negatable Options

Create options that can be negated:

```ts
command('build')
  .description('Build the project')
  .option('--minify/--no-minify', 'Minify output', true)
  .action((options) => {
    console.log(`Minification: ${options.minify ? 'enabled' : 'disabled'}`)
  })
```

### Option Choices

Restrict option values to a predefined set:

```ts
command('deploy')
  .description('Deploy application')
  .option('-e, --environment <env>', 'Deployment environment', {
    choices: ['development', 'staging', 'production'],
    default: 'development',
  })
  .action((options) => {
    console.log(`Deploying to ${options.environment}`)
  })
```

### Coercion

Convert option values to specific types:

```ts
command('resize')
  .description('Resize image')
  .option('-w, --width <width>', 'Width in pixels', {
    coerce: value => Number.parseInt(value, 10),
  })
  .option('-h, --height <height>', 'Height in pixels', {
    coerce: value => Number.parseInt(value, 10),
  })
  .action((options) => {
    // options.width and options.height are numbers
    console.log(`Resizing to ${options.width}x${options.height}`)
  })
```

### Option Dependencies

Create options that depend on other options:

```ts
command('deploy')
  .description('Deploy application')
  .option('-e, --environment <env>', 'Deployment environment')
  .option('-c, --config <path>', 'Config file')
  .dependsOn('config', ['environment'])
  .action((options) => {
    // Requires --environment if --config is provided
    console.log(`Deploying with config: ${options.config}`)
  })
```

## Command Groups

### Command Group Structure

Create hierarchical command structures:

```ts
// Main parent command
const db = command('db')
  .description('Database operations')

// First-level subcommands
db.command('migrate')
  .description('Database migrations')

db.command('seed')
  .description('Seed database')

// Second-level subcommands
const migrateCmd = db.commands.find(cmd => cmd.name === 'migrate')
migrateCmd.command('up')
  .description('Run migrations')

migrateCmd.command('down')
  .description('Rollback migrations')
```

### Shared Options

Share options across related commands:

```ts
import { cli, command, createOption } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

// Create a shared option
const verboseOption = createOption('-v, --verbose', 'Enable verbose output')

// Apply to multiple commands
command('build')
  .description('Build project')
  .addOption(verboseOption)
  .action((options) => {
    if (options.verbose)
      console.log('Verbose mode enabled for build')
    // Build logic...
  })

command('deploy')
  .description('Deploy project')
  .addOption(verboseOption)
  .action((options) => {
    if (options.verbose)
      console.log('Verbose mode enabled for deploy')
    // Deploy logic...
  })
```

## Command Middleware

Use middleware to run code before or after commands:

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

// Authentication middleware
async function requireAuth(next) {
  console.log('Checking authentication...')
  // Check authentication logic here
  const isAuthenticated = true

  if (isAuthenticated) {
    // Continue to the command
    await next()
  }
  else {
    console.error('Authentication failed')
    process.exit(1)
  }
}

// Timing middleware
async function timeExecution(next) {
  const start = Date.now()
  await next()
  const end = Date.now()
  console.log(`Command executed in ${end - start}ms`)
}

// Apply middleware to a command
command('deploy')
  .description('Deploy application')
  .middleware([requireAuth, timeExecution])
  .action(() => {
    console.log('Deploying application...')
  })
```

## Dynamic Commands

Create commands dynamically at runtime:

```ts
import * as fs from 'node:fs'
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

// Generate commands from configuration
function loadCommands() {
  const config = JSON.parse(fs.readFileSync('./commands.json', 'utf8'))

  config.commands.forEach((cmd) => {
    command(cmd.name)
      .description(cmd.description)
      .action(() => {
        console.log(`Executing ${cmd.name}: ${cmd.script}`)
        // Execute cmd.script
      })
  })
}

loadCommands()
app.run()
```

## Command Aliases

Create aliases for commonly used commands:

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

command('install')
  .alias('i') // shorthand alias
  .description('Install dependencies')
  .action(() => {
    console.log('Installing dependencies...')
  })

// Users can now use either:
// $ mycli install
// $ mycli i
```

## Command Hooks

Register hooks that run at different points in the command lifecycle:

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

command('deploy')
  .description('Deploy application')
  .beforeRun(() => {
    console.log('Before deploy...')
    // Run setup tasks
  })
  .afterRun(() => {
    console.log('After deploy...')
    // Run cleanup tasks
  })
  .action(() => {
    console.log('Deploying application...')
  })
```

## Command Composition

Compose complex commands from smaller, reusable parts:

```ts
import { cli, command, createOption } from '@stacksjs/clapp'

// Reusable command parts
function withVerboseOption(cmd) {
  return cmd.option('-v, --verbose', 'Enable verbose output')
}

function withForceOption(cmd) {
  return cmd.option('-f, --force', 'Force operation without confirmation')
}

function withLogging(cmd) {
  return cmd
    .beforeRun(() => {
      console.log(`Running ${cmd.name}...`)
    })
    .afterRun(() => {
      console.log(`${cmd.name} completed`)
    })
}

// Create a command with composition
const buildCmd = command('build')
  .description('Build the project')
  .action((options) => {
    console.log(`Building with options:`, options)
  })

// Apply composable parts
withVerboseOption(buildCmd)
withForceOption(buildCmd)
withLogging(buildCmd)
```

## Error Handling

Handle command errors gracefully:

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

command('risky')
  .description('Run a risky operation')
  .action(async () => {
    try {
      // Attempt risky operation
      const result = await riskyOperation()
      console.log('Operation succeeded:', result)
    }
    catch (err) {
      // Handle specific errors
      if (err.code === 'NETWORK_ERROR') {
        console.error('Network error occurred. Check your connection.')
        process.exit(1)
      }

      // Handle other errors
      console.error('An unexpected error occurred:', err.message)
      process.exit(1)
    }
  })

app.run()
```

## Command Customization

Customize command appearance and behavior:

```ts
import { cli, command, style } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

command('status')
  .description('Show system status')
  .help({
    header: style.blue('STATUS COMMAND'),
    usage: 'mycli status [options]',
    examples: [
      'mycli status',
      'mycli status --json',
      'mycli status --detailed',
    ],
    footer: style.dim('For more information, visit our docs.'),
  })
  .action(() => {
    console.log('System is running')
  })
```

For more information, see the [Commands API Reference](../api/command).
