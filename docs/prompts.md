# Prompts

Clapp provides powerful interactive prompting capabilities to create engaging CLI experiences. The prompts system is designed to be intuitive for both developers and end-users.

## Basic Prompts

Creating a simple text prompt:

```ts
import { prompt } from '@stacksjs/clapp'

// Ask the user for their name
const name = await prompt.text('What is your name?')
console.log(`Hello, ${name}!`)
```

## Prompt Types

Clapp supports various prompt types to handle different input needs:

```ts
// Text input
const name = await prompt.text('Enter your name:', {
  default: 'Guest',
  validate: value => value.length > 0 || 'Name cannot be empty',
})

// Confirmation (yes/no)
const proceed = await prompt.confirm('Continue with installation?', {
  default: true,
})

// Password input (masked)
const password = await prompt.password('Enter your password:')

// Selection from options
const color = await prompt.select('Choose a color:', [
  'red',
  'green',
  'blue',
])

// Multiple selection
const features = await prompt.multiselect('Select features to install:', [
  { name: 'CLI Commands', value: 'commands', checked: true },
  { name: 'Prompts', value: 'prompts' },
  { name: 'Authentication', value: 'auth' },
])

// Number input
const age = await prompt.number('How old are you?', {
  min: 1,
  max: 120,
})
```

## Advanced Options

Each prompt type supports various options to customize behavior:

- `default`: Set a default value
- `validate`: Function to validate user input
- `transform`: Function to transform user input
- `hint`: Additional hint text to display
- `initial`: Initial value (for multi-select)
- `required`: Whether the input is required

## Creating Prompt Sequences

Chain multiple prompts together to create interactive flows:

```ts
import { prompt } from '@stacksjs/clapp'

async function setupProject() {
  const projectName = await prompt.text('Project name:', {
    default: 'my-app',
  })

  const features = await prompt.multiselect('Select features:', [
    { name: 'TypeScript', value: 'ts', checked: true },
    { name: 'ESLint', value: 'eslint' },
    { name: 'Testing', value: 'tests' },
  ])

  const install = await prompt.confirm('Install dependencies now?', {
    default: true,
  })

  return { projectName, features, install }
}

const answers = await setupProject()
console.log('Project configuration:', answers)
```

## Conditional Prompts

You can use conditional logic to show different prompts based on previous answers:

```ts
const type = await prompt.select('Select project type:', [
  'frontend',
  'backend',
  'fullstack',
])

// Only show framework selection for frontend or fullstack
if (type === 'frontend' || type === 'fullstack') {
  const framework = await prompt.select('Select frontend framework:', [
    'vue',
    'react',
    'svelte',
  ])
}

// Only show database selection for backend or fullstack
if (type === 'backend' || type === 'fullstack') {
  const database = await prompt.select('Select database:', [
    'postgres',
    'mysql',
    'mongodb',
  ])
}
```

## Styling Prompts

Clapp prompts can be styled with colors and formatting:

```ts
import { colors, prompt } from '@stacksjs/clapp'

// Using colors in prompts
const name = await prompt.text(`What is your ${colors.blue('name')}?`)

// Customizing prompt appearance
const option = await prompt.select('Choose an option:', [
  { name: colors.green('Safe Option'), value: 'safe' },
  { name: colors.yellow('Medium Risk'), value: 'medium' },
  { name: colors.red('High Risk'), value: 'high' },
])
```

## Integrating with Commands

Prompts work seamlessly with clapp commands:

```ts
import { command, prompt } from '@stacksjs/clapp'

command('setup')
  .description('Set up a new project')
  .action(async () => {
    const name = await prompt.text('Project name:')
    const type = await prompt.select('Project type:', [
      'app',
      'library',
      'plugin',
    ])

    console.log(`Creating ${type} project: ${name}`)
    // Implementation...
  })
```
