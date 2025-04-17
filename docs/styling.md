# Styling

Clapp provides powerful styling capabilities to enhance your CLI application's visual appearance and user experience.

## Text Colors

Apply colors to your text messages:

```ts
import { style } from '@stacksjs/clapp'

// Basic colors
console.log(style.red('Error message'))
console.log(style.green('Success message'))
console.log(style.blue('Information message'))
console.log(style.yellow('Warning message'))

// Additional colors
console.log(style.cyan('Configuration details'))
console.log(style.magenta('Special text'))
console.log(style.white('Normal text'))
console.log(style.gray('Subtle text'))
```

## Background Colors

Add background colors to your text:

```ts
console.log(style.bgRed('Critical error'))
console.log(style.bgGreen('Task completed'))
console.log(style.bgBlue('System notification'))
console.log(style.bgYellow('Important note'))
console.log(style.bgCyan('Step instructions'))
console.log(style.bgMagenta('Highlighted option'))
```

## Text Decorations

Enhance text with decorations:

```ts
console.log(style.bold('Important information'))
console.log(style.italic('Emphasized text'))
console.log(style.underline('Linked resource'))
console.log(style.dim('Less important details'))
console.log(style.inverse('Reversed colors'))
console.log(style.hidden('Hidden text'))
console.log(style.strikethrough('Deprecated feature'))
```

## Combining Styles

Combine multiple style elements:

```ts
console.log(style.bold.red('Critical error!'))
console.log(style.green.underline('Success link'))
console.log(style.yellow.bgBlue.bold('Important notification'))
console.log(style.cyan.italic('Configuration tip'))
```

## Special Formatting

### Progress Indicators

Create progress bars and spinners:

```ts
import { progress, spinner } from '@stacksjs/clapp'

// Progress bar
const bar = progress.bar({
  title: 'Building project',
  total: 100,
})

for (let i = 0; i <= 100; i += 10) {
  bar.update(i)
  // Simulate work being done
  await sleep(200)
}
bar.stop()

// Spinner
const spin = spinner('Loading dependencies')
// Simulate async work
await sleep(2000)
spin.succeed('Dependencies loaded')

// Spinner with custom text
const installSpinner = spinner()
installSpinner.start('Installing packages')
// Simulate async work
await sleep(1500)
installSpinner.text = 'Finalizing installation'
await sleep(500)
installSpinner.succeed('Packages installed successfully')
```

### Tables

Display data in organized tables:

```ts
import { table } from '@stacksjs/clapp'

// Simple table
table([
  ['Name', 'Role', 'Department'],
  ['John Doe', 'Developer', 'Engineering'],
  ['Jane Smith', 'Designer', 'UX/UI'],
  ['Mike Johnson', 'Manager', 'Product'],
])

// Styled table
table([
  [style.bold('Package'), style.bold('Version'), style.bold('Status')],
  ['core', '1.2.0', style.green('up-to-date')],
  ['ui', '0.8.5', style.yellow('update available')],
  ['cli', '0.5.0', style.red('outdated')],
])

// Table with configuration
table([
  ['ID', 'Product', 'Price'],
  ['001', 'Basic Plan', '$9.99'],
  ['002', 'Pro Plan', '$19.99'],
  ['003', 'Enterprise', '$49.99'],
], {
  border: true,
  header: true,
  align: ['left', 'left', 'right'],
})
```

### Boxes and Panels

Create boxed content and panels:

```ts
import { box, panel } from '@stacksjs/clapp'

// Simple box
box('Server running at http://localhost:3000')

// Styled box
box(style.green('Build completed successfully'), {
  padding: 1,
  borderColor: 'green',
  title: 'BUILD STATUS',
})

// Information panel
panel({
  title: 'Getting Started',
  content: `
1. Install dependencies: npm install
2. Start server: npm run dev
3. Open browser: http://localhost:3000
  `,
  borderColor: 'blue',
})
```

## System Messages

Create consistent system messages:

```ts
import { log } from '@stacksjs/clapp'

// Information messages
log.info('Server starting on port 3000')

// Success messages
log.success('Project built successfully')

// Warning messages
log.warn('Configuration file not found, using defaults')

// Error messages
log.error('Failed to connect to database')

// Debug messages (only shown when debug mode is enabled)
log.debug('Processing item #1542')

// Custom messages
log.custom('Deployment', 'Preparing build files', 'cyan')
```

## Interactive Elements

Style interactive CLI elements:

```ts
import { prompt } from '@stacksjs/clapp'

// Styled prompts
const name = await prompt.text('What is your name?', {
  prefix: style.green('?'),
  hint: style.dim('(Enter your full name)'),
})

const option = await prompt.select('Select environment:', [
  { value: 'dev', label: style.cyan('Development') },
  { value: 'staging', label: style.yellow('Staging') },
  { value: 'prod', label: style.red.bold('Production') },
])
```

## Theming

Apply consistent themes across your application:

```ts
import { setTheme } from '@stacksjs/clapp'

// Define a custom theme
setTheme({
  primary: 'blue',
  secondary: 'cyan',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'magenta',
  muted: 'gray',
})

// Now use theme colors
console.log(style.primary('Primary colored text'))
console.log(style.secondary('Secondary colored text'))
console.log(style.success('Success colored text'))
```

## Accessibility

Ensure your styled CLI is accessible:

```ts
import { setAccessibility, style } from '@stacksjs/clapp'

// Enable or disable colors based on terminal capabilities
setAccessibility({
  colors: true, // Set to false to disable colors
  emoji: true, // Set to false to use text alternatives
  ascii: false, // Set to true to use ASCII-only characters
})

// Check if colors are supported
if (style.supportsColor) {
  console.log(style.rainbow('Colors are supported!'))
}
else {
  console.log('Colors are not supported in this environment')
}
```
