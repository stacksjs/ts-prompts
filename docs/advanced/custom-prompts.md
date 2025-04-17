# Custom Prompts

This guide explores advanced techniques for creating and customizing prompts in your clapp applications.

## Creating Custom Prompts

clapp allows you to create your own custom prompts by extending the built-in functionality.

### Basic Custom Prompt

Create a simple custom prompt:

```ts
import { createPrompt } from '@stacksjs/clapp'

// Create an email prompt
const emailPrompt = createPrompt({
  name: 'email',
  validate: (value) => {
    if (!value.includes('@'))
      return 'Please enter a valid email address'
    return true
  },
  transform: value => value.toLowerCase().trim(),
})

// Use the custom prompt
const userEmail = await emailPrompt('Enter your email:')
console.log(`Email: ${userEmail}`)
```

### Advanced Custom Prompt

Build a more sophisticated custom prompt with custom rendering:

```ts
import { createPrompt, cursor, renderPrompt, style } from '@stacksjs/clapp'

// Create a rating prompt (1-5 stars)
const ratingPrompt = createPrompt({
  name: 'rating',
  initialValue: 3,
  validate: (value) => {
    const rating = Number(value)
    if (Number.isNaN(rating) || rating < 1 || rating > 5)
      return 'Rating must be between 1 and 5'
    return true
  },
  render: (state) => {
    // Clear any previous prompt render
    if (state.firstRender)
      cursor.hide()
    else
      renderPrompt.restoreCursor()

    // Render prompt message
    renderPrompt.message(state.message)

    // Render stars
    const rating = Number(state.value) || 0
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
    renderPrompt.value(style.yellow(stars))

    // Render hint
    renderPrompt.hint(' (1-5)')

    // Save cursor position
    renderPrompt.saveCursor()
  },
  keybindings: {
    left: (state) => {
      const current = Number(state.value) || 3
      state.value = String(Math.max(1, current - 1))
    },
    right: (state) => {
      const current = Number(state.value) || 3
      state.value = String(Math.min(5, current + 1))
    },
    number: (state, key) => {
      const num = Number(key.name)
      if (num >= 1 && num <= 5)
        state.value = String(num)
    },
  },
})

// Use the rating prompt
const userRating = await ratingPrompt('Rate your experience:')
console.log(`User rating: ${userRating}/5`)
```

## Extending Existing Prompts

You can extend the built-in prompts to create specialized variants:

```ts
import { prompt } from '@stacksjs/clapp'

// Extend the text prompt for file paths
async function filePathPrompt(message, options = {}) {
  return prompt.text(message, {
    ...options,
    validate: (value) => {
      // Check if the path has the correct format
      if (!value.match(/^([a-z]:)?[/\\]?([^/:*?"<>|]+[/\\])*([^/:*?"<>|]+)?$/i))
        return 'Please enter a valid file path'

      // You could also check if the file exists
      // const exists = fs.existsSync(value)
      // if (!exists) return 'File does not exist'

      return true
    },
  })
}

// Use the extended prompt
const configPath = await filePathPrompt('Path to config file:')
```

## Custom Prompt Layouts

Create prompts with custom layouts:

```ts
import { createPrompt, renderPrompt, style } from '@stacksjs/clapp'

const formPrompt = createPrompt({
  name: 'form',
  initialValue: { name: '', email: '', age: '' },
  validate: (value) => {
    const errors = []

    if (!value.name)
      errors.push('Name is required')

    if (!value.email.includes('@'))
      errors.push('Email must be valid')

    const age = Number(value.age)
    if (Number.isNaN(age) || age < 18)
      errors.push('Age must be at least 18')

    return errors.length ? errors.join('\n') : true
  },
  render: (state) => {
    renderPrompt.restoreCursor()
    renderPrompt.message(state.message)
    renderPrompt.newline()

    const { name, email, age } = state.value
    const fieldActive = state.cursor || 'name'

    // Render each form field
    renderPrompt.field(
      'Name:     ',
      name,
      fieldActive === 'name' ? style.inverse : style.dim
    )
    renderPrompt.newline()

    renderPrompt.field(
      'Email:    ',
      email,
      fieldActive === 'email' ? style.inverse : style.dim
    )
    renderPrompt.newline()

    renderPrompt.field(
      'Age:      ',
      age,
      fieldActive === 'age' ? style.inverse : style.dim
    )
    renderPrompt.newline()

    // Render validation errors
    if (state.error) {
      renderPrompt.newline()
      renderPrompt.error(state.error)
    }

    renderPrompt.saveCursor()
  },
  keybindings: {
    tab: (state) => {
      // Cycle through fields
      const fields = ['name', 'email', 'age']
      const currentIndex = fields.indexOf(state.cursor || 'name')
      state.cursor = fields[(currentIndex + 1) % fields.length]
    },
    up: (state) => {
      // Move to previous field
      const fields = ['name', 'email', 'age']
      const currentIndex = fields.indexOf(state.cursor || 'name')
      state.cursor = fields[(currentIndex - 1 + fields.length) % fields.length]
    },
    down: (state) => {
      // Move to next field
      const fields = ['name', 'email', 'age']
      const currentIndex = fields.indexOf(state.cursor || 'name')
      state.cursor = fields[(currentIndex + 1) % fields.length]
    },
    key: (state, key) => {
      // Update the current field
      const field = state.cursor || 'name'
      if (key.name === 'backspace') {
        state.value[field] = state.value[field].slice(0, -1)
      }
      else if (key.name !== 'return') {
        state.value[field] += key.sequence
      }
    },
  },
})

// Use the form prompt
const userData = await formPrompt('Please fill out your information:')
console.log('User data:', userData)
```

## Interactive Wizards

Create more complex multi-step wizards:

```ts
import { box, prompt, style } from '@stacksjs/clapp'

async function setupWizard() {
  // Welcome screen
  box(style.bold('Project Setup Wizard'), {
    padding: 1,
    borderColor: 'blue',
  })

  // Step 1: Project information
  const projectName = await prompt.text('Project name:', {
    validate: value => value.length > 0 || 'Project name is required',
  })

  const projectType = await prompt.select('Project type:', [
    { value: 'app', label: 'Application' },
    { value: 'lib', label: 'Library' },
    { value: 'api', label: 'API Service' },
  ])

  // Step 2: Dependencies (conditional based on project type)
  let dependencies = []

  if (projectType === 'app') {
    dependencies = await prompt.multiselect('Select frontend dependencies:', [
      { name: 'React', value: 'react', checked: true },
      { name: 'Vue', value: 'vue' },
      { name: 'Tailwind CSS', value: 'tailwind' },
      { name: 'TypeScript', value: 'typescript', checked: true },
    ])
  }
  else if (projectType === 'api') {
    dependencies = await prompt.multiselect('Select backend dependencies:', [
      { name: 'Express', value: 'express', checked: true },
      { name: 'Database ORM', value: 'orm' },
      { name: 'Authentication', value: 'auth' },
      { name: 'TypeScript', value: 'typescript', checked: true },
    ])
  }

  // Step 3: Configuration options
  const config = {}

  if (dependencies.includes('typescript')) {
    config.strict = await prompt.confirm('Enable strict TypeScript mode?', {
      default: true,
    })
  }

  if (projectType === 'app' || projectType === 'api') {
    config.port = await prompt.number('Port number:', {
      default: 3000,
      min: 1024,
      max: 65535,
    })
  }

  // Final confirmation
  const summary = `
Project: ${style.bold(projectName)} (${projectType})
Dependencies: ${dependencies.join(', ') || 'none'}
Configuration: ${Object.entries(config)
  .map(([key, value]) => `${key}: ${value}`)
  .join(', ') || 'default'}
  `

  box(`${style.bold('Project Summary')}\n${summary}`, {
    padding: 1,
  })

  const confirmed = await prompt.confirm('Create project with these settings?')

  if (confirmed) {
    return {
      name: projectName,
      type: projectType,
      dependencies,
      config,
    }
  }

  return null
}

// Run the wizard
const project = await setupWizard()
if (project) {
  console.log('Creating project:', project)
  // Implementation details...
}
```

## State Management in Prompts

Manage complex state in custom prompts:

```ts
import { createPrompt, style } from '@stacksjs/clapp'

// Create a shopping cart prompt
const cartPrompt = createPrompt({
  name: 'cart',
  initialValue: {
    items: [
      { id: 1, name: 'Item 1', price: 10, quantity: 1 },
      { id: 2, name: 'Item 2', price: 15, quantity: 2 },
    ],
    cursor: 0,
  },

  render: (state) => {
    // Render cart items with quantities and prices
    // Allow user to navigate, increase/decrease quantities, etc.
    // Calculate and show total
  },

  keybindings: {
    up: (state) => {
      // Move cursor up
      if (state.value.cursor > 0)
        state.value.cursor--
    },
    down: (state) => {
      // Move cursor down
      if (state.value.cursor < state.value.items.length - 1)
        state.value.cursor++
    },
    plus: (state) => {
      // Increase quantity
      state.value.items[state.value.cursor].quantity++
    },
    minus: (state) => {
      // Decrease quantity (minimum 0)
      const item = state.value.items[state.value.cursor]
      if (item.quantity > 0)
        item.quantity--
    },
    d: (state) => {
      // Delete item
      state.value.items.splice(state.value.cursor, 1)
      if (state.value.cursor >= state.value.items.length)
        state.value.cursor = state.value.items.length - 1
    },
  },

  submit: (state) => {
    // Return only the items, filtering out those with quantity 0
    return state.value.items.filter(item => item.quantity > 0)
  },
})

// Use the shopping cart prompt
const cart = await cartPrompt('Your shopping cart:')
console.log('Cart items:', cart)
```

## Custom Prompt Appearance

Customize the appearance of prompts with themes:

```ts
import { configPrompts, style } from '@stacksjs/clapp'

// Configure global prompt appearance
configPrompts({
  symbols: {
    // Custom symbols
    pointer: '→',
    check: '✓',
    cross: '✗',
    bullet: '•',
  },

  colors: {
    // Custom colors
    primary: style.blue,
    success: style.green,
    error: style.red,
    muted: style.dim,
  },

  formatting: {
    // Custom text formatting
    message: text => style.bold(text),
    hint: text => style.dim(`(${text})`),
    highlight: text => style.underline.cyan(text),
  },
})

// Prompts will now use the custom appearance
```

## Integrating with System State

Create prompts that interact with the system:

```ts
import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import { prompt, spinner } from '@stacksjs/clapp'

// Prompt that shows available disk space
async function diskSpacePrompt(message) {
  const spin = spinner('Checking disk space...')
  spin.start()

  try {
    // Get disk space (this is platform-specific)
    const diskInfo = execSync('df -h').toString()
    spin.stop()

    console.log(diskInfo)

    return prompt.confirm(message)
  }
  catch (err) {
    spin.stop('Failed to check disk space')
    return prompt.confirm(message)
  }
}

// Prompt that shows available npm packages
async function packagePrompt(message) {
  // Get package.json if it exists
  let currentDeps = []
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    currentDeps = Object.keys(packageJson.dependencies || {})
  }
  catch (err) {
    // No package.json found, that's okay
  }

  return prompt.multiselect(message, [
    { name: 'Express', value: 'express', checked: currentDeps.includes('express') },
    { name: 'Lodash', value: 'lodash', checked: currentDeps.includes('lodash') },
    { name: 'Axios', value: 'axios', checked: currentDeps.includes('axios') },
    { name: 'Dotenv', value: 'dotenv', checked: currentDeps.includes('dotenv') },
  ])
}

// Use the system-aware prompts
const shouldProceed = await diskSpacePrompt('Continue with installation?')
if (shouldProceed) {
  const packages = await packagePrompt('Select packages to install:')
  console.log('Installing:', packages)
}
```

For more information on creating and customizing prompts, see the [Prompts API Reference](../api/prompts).
