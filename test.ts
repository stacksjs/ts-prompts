import { box, log, panel, setAccessibility, style, table } from './src/style'

// Force color support to be enabled regardless of environment
setAccessibility({ colors: true })

// Test a variety of style combinations
// eslint-disable-next-line no-console
console.log('Style Test:')
// eslint-disable-next-line no-console
console.log(style.red('This is red text'))
// eslint-disable-next-line no-console
console.log(style.blue('This is blue text'))
// eslint-disable-next-line no-console
console.log(style.green('This is green text'))
// eslint-disable-next-line no-console
console.log(style.yellow.bgBlue.bold('This is yellow text with blue background and bold'))
// eslint-disable-next-line no-console
console.log(style.bold.underline('This is bold and underlined text'))
// eslint-disable-next-line no-console
console.log(style.cyan.italic('This is cyan and italic text'))
// eslint-disable-next-line no-console
console.log(style.yellow.bold.bgRed('This is yellow bold text with red background'))

// Table example
// eslint-disable-next-line no-console
console.log('\nTable Example:')
table([
  ['Name', 'Age', 'City'],
  ['John', '28', 'New York'],
  ['Alice', '24', 'London'],
  ['Bob', '31', 'Paris'],
], { header: true, border: true })

// Box example
// eslint-disable-next-line no-console
console.log('\nBox Example:')
box('This is a sample content\nWith multiple lines\nIn a nice box', {
  title: 'Box Demo',
  padding: 1,
})

// Panel example
// eslint-disable-next-line no-console
console.log('\nPanel Example:')
panel({
  title: 'Panel Demo',
  content: 'This is a sample panel\nWith custom styling',
})

// Log examples
// eslint-disable-next-line no-console
console.log('\nLog Examples:')
log.info('This is an information message')
log.success('This is a success message')
log.warn('This is a warning message')
log.error('This is an error message')
log.custom('★', 'This is a custom log message', 'cyan')

// Progress bar example (commented out as it requires time to demonstrate)
/*
const bar = progress.bar({ title: 'Loading', total: 100 })
for (let i = 0; i <= 100; i += 10) {
  bar.update(i)
  // In real usage, this would have a delay between updates
}
bar.stop()
*/

// Spinner example (commented out as it requires time to demonstrate)
/*
const spin = spinner('Processing')
// In real usage, this would run for some time
setTimeout(() => {
  spin.succeed('Processing complete')
}, 2000)
*/
