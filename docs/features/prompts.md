# Interactive Prompts

clapp provides a rich set of interactive prompts to enhance your CLI applications. These prompts make it easy to collect user input in an elegant and intuitive way.

## Key Features

- **Beautiful Design**: Clean, modern appearance with consistent styling
- **Type-Safe**: Fully typed API for better development experience
- **Customizable**: Extensive options for tailoring appearance and behavior
- **Validation**: Built-in input validation with error messaging
- **Keyboard Navigation**: Intuitive keyboard shortcuts for navigation
- **Accessibility**: Designed with accessibility in mind

## Available Prompt Types

clapp includes a variety of prompt types to handle different input scenarios:

### Text Input

Collect free-form text from users:

```ts
import { prompt } from '@stacksjs/clapp'

const name = await prompt.text('What is your name?', {
  placeholder: 'Enter your name',
  default: 'Guest',
  validate: value => value.length > 0 || 'Name cannot be empty',
})

console.log(`Hello, ${name}!`)
```

### Password Input

Securely collect passwords with masked input:

```ts
const password = await prompt.password('Enter your password:', {
  mask: '*',
  validate: value => value.length >= 8 || 'Password must be at least 8 characters',
})
```

### Confirmation

Ask yes/no questions:

```ts
const shouldProceed = await prompt.confirm('Do you want to continue?', {
  default: true,
})

if (shouldProceed) {
  console.log('Proceeding...')
}
else {
  console.log('Operation cancelled')
}
```

### Selection

Let users choose from a list of options:

```ts
const color = await prompt.select('Choose a color:', [
  'red',
  'green',
  'blue',
  'yellow',
])

// Or with labeled options
const framework = await prompt.select('Select a framework:', [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
])
```

### Multi-select

Allow users to select multiple items:

```ts
const features = await prompt.multiselect('Select features to install:', [
  { name: 'TypeScript', value: 'typescript', checked: true },
  { name: 'ESLint', value: 'eslint' },
  { name: 'Prettier', value: 'prettier' },
  { name: 'Testing', value: 'testing' },
])

console.log(`Selected: ${features.join(', ')}`)
```

### Number Input

Collect numeric input with validation:

```ts
const age = await prompt.number('How old are you?', {
  min: 1,
  max: 120,
  default: 30,
})
```

### Group Multi-select

Organize selection options into logical groups:

```ts
const selections = await prompt.groupMultiselect('Select packages:', {
  Frontend: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ],
  Backend: [
    { value: 'express', label: 'Express' },
    { value: 'fastify', label: 'Fastify' },
  ],
  Database: [
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'mongodb', label: 'MongoDB' },
  ],
})
```

### Informational Note

Display information to users:

```ts
prompt.note(
  'This operation will modify your package.json file.',
  'Important Notice'
)
```

## Progress Indicators

Show progress for long-running tasks:

### Spinner

Display an animated spinner during asynchronous operations:

```ts
import { spinner } from '@stacksjs/clapp'

const spin = spinner('Installing dependencies')
spin.start()

// Simulate work
await someAsyncOperation()

// Update message during operation
spin.message('Configuring packages')

// Complete the operation
spin.stop('Installation complete!')
```

### Progress Bar

Show progress for operations with known completion percentages:

```ts
import { progress } from '@stacksjs/clapp'

const bar = progress.bar({
  title: 'Downloading files',
  total: 100,
})

// Update progress as work completes
for (let i = 0; i <= 100; i += 10) {
  bar.update(i)
  await sleep(200) // simulate work
}

bar.stop()
```

## Customizing Prompts

All prompts support customization options:

### Styling

Apply colors and formatting to prompt elements:

```ts
import { prompt, style } from '@stacksjs/clapp'

const option = await prompt.select('Choose an environment:', [
  { value: 'dev', label: style.green('Development') },
  { value: 'staging', label: style.yellow('Staging') },
  { value: 'prod', label: style.red.bold('Production') },
])
```

### Validation

Add input validation with custom error messages:

```ts
const email = await prompt.text('Email address:', {
  validate: (value) => {
    if (!value.includes('@'))
      return 'Please enter a valid email address'
    return true
  },
})
```

### Transformation

Transform user input before returning:

```ts
const username = await prompt.text('Username:', {
  transform: value => value.toLowerCase().trim(),
})
```

### Custom Prompts

Create your own custom prompts by extending the base functionality:

```ts
import { createPrompt } from '@stacksjs/clapp'

// Create a custom prompt for email input
const emailPrompt = createPrompt({
  name: 'email',
  validate: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    return emailRegex.test(value) || 'Please enter a valid email address'
  },
  transform: value => value.toLowerCase().trim(),
})

// Use the custom prompt
const userEmail = await emailPrompt('Enter your email:')
```

## Multi-step Flows

Chain prompts together to create multi-step interactive experiences:

```ts
import { prompt } from '@stacksjs/clapp'

async function setupProject() {
  // Step 1: Basic info
  const name = await prompt.text('Project name:')
  const description = await prompt.text('Description:')

  // Step 2: Choose project type
  const type = await prompt.select('Project type:', [
    'library',
    'application',
    'plugin',
  ])

  // Step 3: Conditional flow based on type
  let framework = null
  if (type === 'application') {
    framework = await prompt.select('Framework:', [
      'react',
      'vue',
      'angular',
    ])
  }

  // Step 4: Select features
  const features = await prompt.multiselect('Features:', [
    { name: 'TypeScript', value: 'typescript', checked: true },
    { name: 'Testing', value: 'testing' },
    { name: 'Linting', value: 'linting' },
  ])

  // Final step: Confirmation
  const confirm = await prompt.confirm('Create project with these settings?')

  if (confirm) {
    return { name, description, type, framework, features }
  }

  return null
}

const project = await setupProject()
if (project) {
  console.log('Creating project with:', project)
}
```

For more detailed information on each prompt type, see the [Prompts API Reference](../api/prompts).
