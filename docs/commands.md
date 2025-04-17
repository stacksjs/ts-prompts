# Commands

Clapp provides a simple yet powerful way to create CLI commands for your applications.

## Creating Commands

### Basic Command

Create a basic command with a name, description, and action:

```ts
import { command } from '@stacksjs/clapp'

command('hello')
  .description('Say hello to someone')
  .action(() => {
    console.log('Hello, world!')
  })
```

### Command with Arguments

Add arguments to your commands:

```ts
command('greet')
  .description('Greet a user')
  .argument('<name>', 'Name of the person to greet')
  .action((name) => {
    console.log(`Hello, ${name}!`)
  })
```

### Multiple Arguments

Commands can accept multiple arguments:

```ts
command('add')
  .description('Add two numbers')
  .argument('<number1>', 'First number')
  .argument('<number2>', 'Second number')
  .action((number1, number2) => {
    const sum = Number(number1) + Number(number2)
    console.log(`${number1} + ${number2} = ${sum}`)
  })
```

### Optional Arguments

Make arguments optional by using square brackets:

```ts
command('welcome')
  .description('Welcome message')
  .argument('[name]', 'Name of the person', 'Guest')
  .action((name) => {
    console.log(`Welcome, ${name}!`)
  })
```

## Options

Add options to customize command behavior:

```ts
command('build')
  .description('Build the project')
  .option('-m, --mode <mode>', 'Build mode (development/production)', 'development')
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

### Boolean Options

Create flag options that don't require values:

```ts
command('deploy')
  .description('Deploy application')
  .option('-f, --force', 'Force deployment without confirmation')
  .action((options) => {
    if (options.force) {
      console.log('Deploying without confirmation...')
    }
    else {
      console.log('Deployment requires confirmation...')
    }
  })
```

### Options with Default Values

Specify default values for options:

```ts
command('serve')
  .description('Start development server')
  .option('-p, --port <port>', 'Port to use', '3000')
  .option('-h, --host <host>', 'Host to use', 'localhost')
  .action((options) => {
    console.log(`Starting server at ${options.host}:${options.port}`)
  })
```

## Subcommands

Create command hierarchies using subcommands:

```ts
const db = command('db')
  .description('Database operations')

db.command('migrate')
  .description('Run database migrations')
  .option('--dry-run', 'Show migration SQL without executing')
  .action((options) => {
    console.log('Running migrations...')
    if (options.dryRun)
      console.log('(Dry run mode)')
  })

db.command('seed')
  .description('Seed database with data')
  .action(() => {
    console.log('Seeding database...')
  })
```

## Command Validation

Validate arguments and options:

```ts
command('resize')
  .description('Resize an image')
  .argument('<file>', 'Image file to resize')
  .option('-w, --width <width>', 'New width')
  .option('-h, --height <height>', 'New height')
  .action((file, options) => {
    // Validate file exists
    if (!fileExists(file)) {
      console.error(`Error: File ${file} does not exist`)
      return
    }

    // Validate width and height
    const width = Number(options.width)
    const height = Number(options.height)

    if (options.width && Number.isNaN(width)) {
      console.error('Error: Width must be a number')
      return
    }

    if (options.height && Number.isNaN(height)) {
      console.error('Error: Height must be a number')
      return
    }

    console.log(`Resizing ${file} to ${width}x${height}`)
  })
```

## Integrating with Prompts

Commands work seamlessly with clapp prompts:

```ts
import { command, prompt } from '@stacksjs/clapp'

command('init')
  .description('Initialize a new project')
  .action(async () => {
    const name = await prompt.text('Project name:')
    const type = await prompt.select('Project type:', [
      'frontend',
      'backend',
      'fullstack',
    ])

    console.log(`Creating ${type} project: ${name}`)
    // Implementation...
  })
```

## Command Help

Clapp automatically generates help text for all commands:

```ts
// Help is available with --help or -h flag
// $ mycli build --help
```

## Putting It All Together

Here's an example of a complete CLI application:

```ts
import { cli, command } from '@stacksjs/clapp'

// Define the CLI application
const app = cli({
  name: 'mycli',
  version: '1.0.0',
  description: 'My awesome CLI app',
})

// Add commands
command('hello')
  .description('Say hello')
  .argument('[name]', 'Name to greet', 'world')
  .action((name) => {
    console.log(`Hello, ${name}!`)
  })

command('build')
  .description('Build the project')
  .option('-m, --mode <mode>', 'Build mode', 'production')
  .action((options) => {
    console.log(`Building in ${options.mode} mode...`)
  })

// Run the CLI app
app.run()
```
