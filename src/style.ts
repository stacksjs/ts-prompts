import process from 'node:process'

interface Styler {
  // Basic colors
  red: StylerFunction
  green: StylerFunction
  blue: StylerFunction
  yellow: StylerFunction
  cyan: StylerFunction
  magenta: StylerFunction
  white: StylerFunction
  gray: StylerFunction

  // Background colors
  bgRed: StylerFunction
  bgGreen: StylerFunction
  bgBlue: StylerFunction
  bgYellow: StylerFunction
  bgCyan: StylerFunction
  bgMagenta: StylerFunction

  // Text decorations
  bold: StylerFunction
  italic: StylerFunction
  underline: StylerFunction
  dim: StylerFunction
  inverse: StylerFunction
  hidden: StylerFunction
  strikethrough: StylerFunction

  // Theme colors (when theme is applied)
  primary: StylerFunction
  secondary: StylerFunction
  success: StylerFunction
  warning: StylerFunction
  error: StylerFunction
  info: StylerFunction
  muted: StylerFunction

  // Feature detection
  supportsColor: boolean

  // Allow chaining of styles
  [key: string]: StylerFunction | boolean
}

interface StylerFunction {
  (text: string): string
  [key: string]: StylerFunction
}

// ANSI color codes
const codes = {
  // Text colors
  red: ['\x1B[31m', '\x1B[39m'],
  green: ['\x1B[32m', '\x1B[39m'],
  blue: ['\x1B[34m', '\x1B[39m'],
  yellow: ['\x1B[33m', '\x1B[39m'],
  cyan: ['\x1B[36m', '\x1B[39m'],
  magenta: ['\x1B[35m', '\x1B[39m'],
  white: ['\x1B[37m', '\x1B[39m'],
  gray: ['\x1B[90m', '\x1B[39m'],

  // Background colors
  bgRed: ['\x1B[41m', '\x1B[49m'],
  bgGreen: ['\x1B[42m', '\x1B[49m'],
  bgBlue: ['\x1B[44m', '\x1B[49m'],
  bgYellow: ['\x1B[43m', '\x1B[49m'],
  bgCyan: ['\x1B[46m', '\x1B[49m'],
  bgMagenta: ['\x1B[45m', '\x1B[49m'],

  // Text decorations
  bold: ['\x1B[1m', '\x1B[22m'],
  italic: ['\x1B[3m', '\x1B[23m'],
  underline: ['\x1B[4m', '\x1B[24m'],
  dim: ['\x1B[2m', '\x1B[22m'],
  inverse: ['\x1B[7m', '\x1B[27m'],
  hidden: ['\x1B[8m', '\x1B[28m'],
  strikethrough: ['\x1B[9m', '\x1B[29m'],
}

// Theme defaults (populated via setTheme)
let theme: Record<string, string> = {
  primary: 'blue',
  secondary: 'cyan',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'magenta',
  muted: 'gray',
}

// Feature detection for color support
function detectColorSupport(): boolean {
  // Check for NO_COLOR env variable
  if (process.env.NO_COLOR !== undefined)
    return false

  // Check for FORCE_COLOR env variable
  if (process.env.FORCE_COLOR !== undefined)
    return true

  // Check for CI environments which often don't support colors
  if (process.env.CI !== undefined)
    return false

  // Check if stdout is a TTY
  if (process.stdout && process.stdout.isTTY)
    return true

  return false
}

// Create the base style object
function createStyler(): Styler {
  const styler: Styler = {} as Styler

  // Detect color support
  styler.supportsColor = detectColorSupport()

  // Function to create a styler for a specific code
  const createStylerFunction = (styleName: string): StylerFunction => {
    const styleFunc = (text: string): string => {
      if (!styler.supportsColor)
        return text

      // For theme colors, redirect to the mapped color
      if (styleName in theme) {
        const mappedColor = theme[styleName as keyof typeof theme]
        if (mappedColor in codes)
          return `${codes[mappedColor as keyof typeof codes][0]}${text}${codes[mappedColor as keyof typeof codes][1]}`
      }

      // For regular colors/styles
      if (styleName in codes)
        return `${codes[styleName as keyof typeof codes][0]}${text}${codes[styleName as keyof typeof codes][1]}`

      return text
    }

    // Make each function chainable with every other style
    Object.keys(codes).forEach((code) => {
      Object.defineProperty(styleFunc, code, {
        get: () => {
          const combinedStyler = (text: string): string => {
            // Apply the first style, then the chained style
            return (codes[code as keyof typeof codes][0]
              + (codes[styleName as keyof typeof codes]?.[0] || '')
              + text
              + (codes[styleName as keyof typeof codes]?.[1] || '')
              + codes[code as keyof typeof codes][1])
          }

          // Make this new function also chainable
          Object.keys(codes).forEach((nestedCode) => {
            Object.defineProperty(combinedStyler, nestedCode, {
              get: () => {
                // This would handle color.red.bold.underline etc.
                // But for simplicity we're not implementing deep nesting here
                return createStylerFunction(`${styleName}.${code}.${nestedCode}`)
              },
            })
          })

          return combinedStyler
        },
      })
    })

    return styleFunc as StylerFunction
  }

  // Add all style functions to the styler object
  Object.keys(codes).forEach((code) => {
    styler[code as keyof typeof codes] = createStylerFunction(code)
  })

  // Add theme colors
  Object.keys(theme).forEach((themeColor) => {
    styler[themeColor] = createStylerFunction(themeColor)
  })

  return styler
}

// Create the style object
export const style = createStyler()

// Function to set custom theme
export function setTheme(customTheme: Partial<typeof theme>): void {
  theme = { ...theme, ...customTheme }
}

// Function to set accessibility options
export function setAccessibility(options: { colors?: boolean, emoji?: boolean, ascii?: boolean }): void {
  if (options.colors !== undefined) {
    style.supportsColor = options.colors
  }
}

// Box and panel function placeholders (full implementation would be more complex)
export function box(content: string, options?: { padding?: number, borderColor?: string, title?: string }): void {
  // Simplified implementation
  const title = options?.title ? ` ${options.title} ` : ''
  const padding = options?.padding || 0
  const paddingStr = ' '.repeat(padding)

  const lines = content.split('\n')
  const width = Math.max(...lines.map(line => line.length)) + padding * 2

  console.log(`┌${title ? '─'.repeat(Math.floor((width - title.length) / 2)) + title + '─'.repeat(Math.ceil((width - title.length) / 2)) : '─'.repeat(width + 2)}┐`)
  console.log(`│${' '.repeat(width + 2)}│`)

  for (const line of lines) {
    console.log(`│ ${paddingStr}${line}${' '.repeat(width - line.length - padding)}${paddingStr} │`)
  }

  console.log(`│${' '.repeat(width + 2)}│`)
  console.log(`└${'─'.repeat(width + 2)}┘`)
}

export function panel(options: { title?: string, content: string, borderColor?: string }): void {
  box(options.content, { title: options.title, borderColor: options.borderColor })
}

// Progress indicator placeholders
export const progress = {
  bar: (options: { title: string, total: number }) => {
    let current = 0
    return {
      update: (value: number): void => {
        current = value
        const percentage = Math.floor((current / options.total) * 100)
        const barWidth = 30
        const filledWidth = Math.floor((barWidth * current) / options.total)
        const emptyWidth = barWidth - filledWidth

        process.stdout.write(`\r${options.title}: [${'='.repeat(filledWidth)}${' '.repeat(emptyWidth)}] ${percentage}%`)
      },
      stop: (): void => {
        process.stdout.write('\n')
      },
    }
  },
}

interface Spinner {
  start: (startText?: string) => Spinner
  stop: () => Spinner
  succeed: (successText?: string) => Spinner
  fail: (failText?: string) => Spinner
  text: string
}

export function spinner(text?: string): Spinner {
  const frames: string[] = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let i = 0
  let interval: NodeJS.Timeout | null = null
  let currentText = text || ''

  const spinnerObj: Spinner = {
    start: (startText?: string): Spinner => {
      if (startText)
        currentText = startText
      interval = setInterval(() => {
        process.stdout.write(`\r${frames[i = ++i % frames.length]} ${currentText}`)
      }, 80)
      return spinnerObj
    },
    stop: (): Spinner => {
      if (interval) {
        clearInterval(interval)
        process.stdout.write('\r \r')
      }
      return spinnerObj
    },
    succeed: (successText?: string): Spinner => {
      if (interval) {
        clearInterval(interval)
        process.stdout.write(`\r✓ ${successText || currentText}\n`)
      }
      return spinnerObj
    },
    fail: (failText?: string): Spinner => {
      if (interval) {
        clearInterval(interval)
        process.stdout.write(`\r✗ ${failText || currentText}\n`)
      }
      return spinnerObj
    },
    set text(newText: string) {
      currentText = newText
    },
    get text(): string {
      return currentText
    },
  }

  return spinnerObj
}

// Table function placeholder
export function table(data: string[][], options?: { border?: boolean, header?: boolean, align?: ('left' | 'right' | 'center')[] }): void {
  // Simple implementation for demonstration
  if (!data || data.length === 0)
    return

  // Calculate column widths
  const colWidths: number[] = Array.from({ length: data[0].length }).fill(0)
  for (const row of data) {
    for (let i = 0; i < row.length; i++) {
      colWidths[i] = Math.max(colWidths[i], String(row[i]).length)
    }
  }

  // Draw top border
  if (options?.border) {
    console.log(`┌${colWidths.map((w: number) => '─'.repeat(w + 2)).join('┬')}┐`)
  }

  // Draw header
  if (options?.header && data.length > 0) {
    console.log(
      (options.border ? '│ ' : '')
      + data[0].map((cell: string, i: number) => `${cell}${' '.repeat(colWidths[i] - String(cell).length)}`).join(' │ ')
      + (options.border ? ' │' : ''),
    )

    if (options.border) {
      console.log(`├${colWidths.map((w: number) => '─'.repeat(w + 2)).join('┼')}┤`)
    }
    else {
      console.log(`${colWidths.map((w: number) => '─'.repeat(w)).join('─┼─')}`)
    }
  }

  // Draw data rows
  const startRow = options?.header ? 1 : 0
  for (let r = startRow; r < data.length; r++) {
    console.log(
      (options?.border ? '│ ' : '')
      + data[r].map((cell: string, i: number) => `${cell}${' '.repeat(colWidths[i] - String(cell).length)}`).join(' │ ')
      + (options?.border ? ' │' : ''),
    )
  }

  // Draw bottom border
  if (options?.border) {
    console.log(`└${colWidths.map((w: number) => '─'.repeat(w + 2)).join('┴')}┘`)
  }
}

// System message logger
export const log = {
  info: (message: string): void => {
    console.log(`${style.blue('ℹ')} ${message}`)
  },
  success: (message: string): void => {
    console.log(`${style.green('✓')} ${message}`)
  },
  warn: (message: string): void => {
    console.log(`${style.yellow('⚠')} ${message}`)
  },
  error: (message: string): void => {
    console.log(`${style.red('✗')} ${message}`)
  },
  debug: (message: string): void => {
    if (process.env.DEBUG) {
      console.log(`${style.magenta('🐞')} ${message}`)
    }
  },
  custom: (prefix: string, message: string, color: keyof typeof style): void => {
    const colorFunc = style[color as keyof typeof style] as StylerFunction
    console.log(`${colorFunc(prefix)} ${message}`)
  },
}
