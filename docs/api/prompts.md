# Prompts API Reference

The `prompts` module provides interactive command-line prompts for gathering user input.

## Core Prompt Functions

### text(options)

Prompts the user to enter text.

```ts
import { prompt } from '@stacksjs/clapp'

const name = await prompt.text('What is your name?')
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | The prompt message | Required |
| `default` | `string` | Default value | `''` |
| `placeholder` | `string` | Placeholder text | `''` |
| `initial` | `string` | Initial value (shown and used as default) | `''` |
| `validate` | `Function` | Validation function | `undefined` |
| `transform` | `Function` | Transform the final value | `undefined` |
| `hint` | `string` | Additional hint text | `''` |
| `required` | `boolean` | Whether input is required | `true` |

#### Returns

Returns a Promise that resolves to the user's input as a string.

### password(options)

Prompts the user to enter a password (with masked input).

```ts
const password = await prompt.password('Enter your password:')
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | The prompt message | Required |
| `mask` | `string` | Character to display instead of actual input | `'*'` |
| `validate` | `Function` | Validation function | `undefined` |
| `required` | `boolean` | Whether input is required | `true` |

#### Returns

Returns a Promise that resolves to the user's input as a string.

### confirm(options)

Prompts the user to confirm with a yes/no question.

```ts
const shouldProceed = await prompt.confirm('Do you want to continue?')
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | The prompt message | Required |
| `default` | `boolean` | Default value | `true` |
| `active` | `string` | Text for the active/yes state | `'Yes'` |
| `inactive` | `string` | Text for the inactive/no state | `'No'` |

#### Returns

Returns a Promise that resolves to a boolean.

### select(options)

Prompts the user to select an option from a list.

```ts
const color = await prompt.select('Choose a color:', [
  'red',
  'green',
  'blue',
])

// Or with labeled options
const framework = await prompt.select('Select a framework:', [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'svelte', label: 'Svelte' },
])
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | The prompt message | Required |
| `options` | `Array` | Array of options to select from | Required |
| `initial` | `number` | Index of the default selected option | `0` |
| `hint` | `string` | Additional hint text | `''` |
| `maxItems` | `number` | Max number of items to show at once | `undefined` |

#### Option Items

Each option in the `options` array can be:

- A string (used as both value and label)
- An object with properties:
  - `value`: The value to return when selected
  - `label`: The display text (optional, defaults to value)
  - `hint`: Additional hint text for this option (optional)

#### Returns

Returns a Promise that resolves to the selected option's value.

### multiselect(options)

Prompts the user to select multiple options from a list.

```ts
const features = await prompt.multiselect('Select features:', [
  { name: 'TypeScript', value: 'ts', checked: true },
  { name: 'ESLint', value: 'eslint' },
  { name: 'Testing', value: 'tests' },
])
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | The prompt message | Required |
| `options` | `Array` | Array of options to select from | Required |
| `initialValues` | `Array` | Array of initially selected values | `[]` |
| `cursorAt` | `any` | Value to place cursor at initially | `undefined` |
| `required` | `boolean` | Whether at least one selection is required | `true` |
| `hint` | `string` | Additional hint text | `''` |
| `maxItems` | `number` | Max number of items to show at once | `undefined` |

#### Option Items

Each option in the `options` array should be an object with properties:

- `value`: The value to return when selected
- `name` or `label`: The display text
- `checked`: Whether the option is initially selected (optional)
- `hint`: Additional hint text for this option (optional)

#### Returns

Returns a Promise that resolves to an array of selected option values.

### number(options)

Prompts the user to enter a number.

```ts
const age = await prompt.number('How old are you?', {
  min: 1,
  max: 120,
})
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | The prompt message | Required |
| `default` | `number` | Default value | `undefined` |
| `min` | `number` | Minimum allowed value | `undefined` |
| `max` | `number` | Maximum allowed value | `undefined` |
| `validate` | `Function` | Validation function | `undefined` |
| `hint` | `string` | Additional hint text | `''` |

#### Returns

Returns a Promise that resolves to a number.

### groupMultiselect(options)

Prompts the user to select multiple options from grouped lists.

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
})
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | The prompt message | Required |
| `options` | `Object` | Object of option groups | Required |
| `initialValues` | `Array` | Array of initially selected values | `[]` |
| `cursorAt` | `any` | Value to place cursor at initially | `undefined` |
| `required` | `boolean` | Whether at least one selection is required | `true` |
| `selectableGroups` | `boolean` | Whether groups can be selected as a whole | `true` |
| `groupSpacing` | `number` | Number of lines between groups | `1` |

#### Returns

Returns a Promise that resolves to an array of selected option values.

### note(message, title, options)

Displays a note to the user.

```ts
prompt.note('This will modify your config files.', 'Warning')
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `message` | `string` | The note message | Required |
| `title` | `string` | Title for the note | `''` |
| `options` | `object` | Additional options | `{}` |

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `format` | `Function` | Format function for each line | `undefined` |

## Progress Indicators

### spinner(options)

Creates a spinner for indicating progress during async operations.

```ts
import { spinner } from '@stacksjs/clapp'

const spin = spinner('Loading dependencies')
spin.start()

// Do some work
await someAsyncOperation()

// Update spinner text
spin.message('Finalizing installation')

// Complete the spinner
spin.stop('Dependencies loaded successfully')
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `message` | `string` | Initial spinner message | `''` |
| `frames` | `string[]` | Custom animation frames | Default spinner frames |
| `interval` | `number` | Animation speed in milliseconds | `80` |
| `indicator` | `string` | Indicator type ('spinner' or 'timer') | `'spinner'` |
| `color` | `string` or `Function` | Color for the spinner | Default color |
| `successColor` | `string` or `Function` | Color for success message | Green |
| `errorColor` | `string` or `Function` | Color for error message | Red |
| `cancelMessage` | `string` | Message when cancelled | `'Operation cancelled'` |
| `errorMessage` | `string` | Message when errored | `'Operation failed'` |

#### Returns

Returns a spinner object with the following methods:

- `start(message?)`: Start the spinner with an optional message
- `stop(message?, code?)`: Stop the spinner with an optional message and code (0: success, 1: cancel, 2+: error)
- `message(text)`: Update the spinner message

### progress.bar(options)

Creates a progress bar for indicating progress with percentage.

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

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `title` | `string` | Title of the progress bar | `''` |
| `total` | `number` | Total steps (100%) | Required |
| `width` | `number` | Width of the progress bar | `30` |
| `complete` | `string` | Character for completed portion | `'█'` |
| `incomplete` | `string` | Character for incomplete portion | `'░'` |
| `showPercent` | `boolean` | Show percentage number | `true` |

#### Returns

Returns a progress bar object with the following methods:

- `update(value)`: Update the progress to a specific value
- `increment(delta?)`: Increment the progress by delta (default: 1)
- `stop(message?)`: Stop the progress bar with an optional message

## Utility Functions

### isCancel(value)

Checks if a prompt was cancelled.

```ts
const name = await prompt.text('What is your name?')

if (prompt.isCancel(name)) {
  console.log('Operation cancelled')
  process.exit(0)
}
```

#### Parameters

| Parameter | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| `value` | `any` | The value to check | Required |

#### Returns

Returns `true` if the value indicates the prompt was cancelled.

### createPrompt(options)

Creates a custom prompt.

```ts
import { createPrompt } from '@stacksjs/clapp'

const emailPrompt = createPrompt({
  name: 'email',
  validate: (value) => {
    if (!value.includes('@'))
      return 'Please enter a valid email address'
    return true
  },
  transform: value => value.toLowerCase().trim(),
})

const email = await emailPrompt('Enter your email:')
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `name` | `string` | Name of the prompt type | Required |
| `initialValue` | `any` | Initial value | `undefined` |
| `render` | `Function` | Custom render function | Default renderer |
| `validate` | `Function` | Validation function | `undefined` |
| `transform` | `Function` | Transform function | `undefined` |
| `keybindings` | `Object` | Custom key handlers | `{}` |
| `submit` | `Function` | Submit handler | Default handler |
| `cancel` | `Function` | Cancel handler | Default handler |

#### Returns

Returns a function that can be called to display the custom prompt.

## Advanced Usage Examples

### Validation

Add custom validation to any prompt:

```ts
const username = await prompt.text('Username:', {
  validate: (value) => {
    if (value.length < 3)
      return 'Username must be at least 3 characters'
    if (!/^[\w-]+$/.test(value))
      return 'Username can only contain letters, numbers, underscores, and hyphens'
    return true
  },
})
```

### Transformation

Transform user input before returning:

```ts
const tag = await prompt.text('Git tag:', {
  transform: value => `v${value}`.replace(/^vv/, 'v'),
})
```

### Custom Prompts

Create entirely custom prompts:

```ts
import { createPrompt, style } from '@stacksjs/clapp'

// Create a rating prompt (1-5 stars)
const ratingPrompt = createPrompt({
  name: 'rating',
  initialValue: 3,
  render: (state) => {
    // Custom rendering logic here
    const stars = '★'.repeat(state.value) + '☆'.repeat(5 - state.value)
    console.log(`${state.message}\n${style.yellow(stars)} (${state.value}/5)`)
  },
  keybindings: {
    // Custom key handlers
    up: (state) => {
      state.value = Math.min(5, state.value + 1)
    },
    down: (state) => {
      state.value = Math.max(1, state.value - 1)
    },
  },
})

const rating = await ratingPrompt('Rate your experience:')
```

### Multi-step Flows

Chain prompts to create multi-step flows:

```ts
async function setupProject() {
  const name = await prompt.text('Project name:')

  const type = await prompt.select('Project type:', [
    'library',
    'application',
    'plugin',
  ])

  let framework = null
  if (type === 'application') {
    framework = await prompt.select('Framework:', [
      'react',
      'vue',
      'angular',
    ])
  }

  const features = await prompt.multiselect('Features:', [
    { name: 'TypeScript', value: 'typescript', checked: true },
    { name: 'Testing', value: 'testing' },
    { name: 'Linting', value: 'linting' },
  ])

  const confirm = await prompt.confirm('Create project with these settings?')

  if (confirm) {
    const spin = spinner('Creating project')
    spin.start()

    // Project creation logic here...
    await sleep(2000)

    spin.stop('Project created successfully!')
    return { name, type, framework, features }
  }

  return null
}

const project = await setupProject()
```
