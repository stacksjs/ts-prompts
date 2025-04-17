import { setAccessibility, style } from './src/style'

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
