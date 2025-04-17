# Get Started

Learn how to create your first CLI application with clapp.

## Basic CLI Application

Creating a simple CLI application is straightforward:

```ts
import { cli, command } from '@stacksjs/clapp'

// Create a CLI application
const app = cli({
  name: 'mycli',
  version: '1.0.0',
  description: 'My awesome CLI application',
})

// Add a simple command
command('hello')
  .description('Say hello to someone')
  .argument('[name]', 'Name to greet', 'world')
  .action((name) => {
    console.log(`Hello, ${name}!`)
  })

// Run the CLI
app.run()
```

## Adding Interactive Prompts

Enhance your CLI with interactive prompts:

```ts
import { cli, command, prompt } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
})

command('init')
  .description('Initialize a new project')
  .action(async () => {
    // Ask for project name
    const name = await prompt.text('Project name:', {
      default: 'my-app',
      validate: value => value.length > 0 || 'Name cannot be empty',
    })

    // Choose a template
    const template = await prompt.select('Select a template:', [
      { value: 'default', label: 'Default Project' },
      { value: 'api', label: 'API Service' },
      { value: 'fullstack', label: 'Full-Stack App' },
    ])

    // Select features
    const features = await prompt.multiselect('Select features:', [
      { name: 'TypeScript', value: 'typescript', checked: true },
      { name: 'ESLint', value: 'eslint' },
      { name: 'Testing', value: 'testing' },
    ])

    console.log(`Creating ${template} project: ${name}`)
    console.log(`Selected features: ${features.join(', ')}`)

    // Implementation would go here...
  })

app.run()
```

## Command Structure

Structure your commands for better organization:

```ts
import { cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

// Create a parent command
const db = command('db')
  .description('Database operations')

// Add subcommands
db.command('migrate')
  .description('Run database migrations')
  .option('--dry-run', 'Show migrations without executing')
  .action((options) => {
    console.log(`Running migrations ${options.dryRun ? '(dry run)' : ''}`)
  })

db.command('seed')
  .description('Seed the database')
  .action(() => {
    console.log('Seeding database')
  })

// Another top-level command
command('build')
  .description('Build the project')
  .option('-m, --mode <mode>', 'Build mode', 'production')
  .action((options) => {
    console.log(`Building in ${options.mode} mode`)
  })

app.run()
```

## Using Styles

Enhance your CLI's appearance with styling:

```ts
import { cli, command, style } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

command('status')
  .description('Show system status')
  .action(() => {
    console.log(style.bold.blue('System Status:'))
    console.log(`Database: ${style.green('Connected')}`)
    console.log(`API: ${style.yellow('Degraded')}`)
    console.log(`Cache: ${style.red('Offline')}`)

    console.log(`\n${style.bgBlue.white(' ACTIONS ')}`)
    console.log(`- Run ${style.cyan('mycli restart')} to restart services`)
    console.log(`- Run ${style.cyan('mycli logs')} to view logs`)
  })

app.run()
```

## Using Progress Indicators

Show progress for long-running tasks:

```ts
import { cli, command, spinner } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
})

command('install')
  .description('Install dependencies')
  .action(async () => {
    // Create a spinner
    const spin = spinner('Installing dependencies')
    spin.start()

    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update spinner text
    spin.message('Finalizing installation')

    // Simulate more work
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Complete the task
    spin.stop('Dependencies installed successfully')
  })

app.run()
```

## Building and Distribution

To build your CLI application for distribution:

```bash
# Build the project
bun run build

# Test your CLI locally
bun link
mycli --help
```

For more advanced usage, check out the [Commands](./commands) and [Prompts](./prompts) sections.
