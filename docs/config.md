# Configuration

Clapp provides various ways to configure your CLI application behavior.

## Application Configuration

When creating a CLI application, you can pass configuration options to customize its behavior:

```ts
import { cli } from '@stacksjs/clapp'

const app = cli({
  // Basic application info
  name: 'mycli',
  version: '1.0.0',
  description: 'My awesome CLI application',

  // Customize the binary name when installed globally
  bin: 'mycli',

  // Enable strict mode for commands and options
  strictCommands: true,
  strictOptions: true,

  // Help and version flags
  autoHelp: true,
  autoVersion: true,
  helpCommand: true,

  // Process behavior
  exitProcess: true,
})
```

### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `name` | `string` | The name of the CLI application | Required |
| `version` | `string` | The version of the CLI application | Required |
| `description` | `string` | A description of the CLI application | `''` |
| `bin` | `string` | The binary name to use when the CLI is installed globally | Same as `name` |
| `strictCommands` | `boolean` | Whether to error for unknown commands | `false` |
| `strictOptions` | `boolean` | Whether to error for unknown options | `false` |
| `autoHelp` | `boolean` | Whether to automatically show help for unknown commands | `true` |
| `autoVersion` | `boolean` | Whether to automatically add a version command | `true` |
| `helpCommand` | `boolean` | Whether to add a help command | `true` |
| `exitProcess` | `boolean` | Whether to exit the process when a command fails | `true` |
| `noDefaultHelp` | `boolean` | Whether to disable the default help output | `false` |

## Prompt Configuration

### Global Prompt Settings

Configure default behavior for all prompts:

```ts
import { configPrompts } from '@stacksjs/clapp'

configPrompts({
  // Symbols used in prompts
  symbols: {
    pointer: '→',
    check: '✓',
    cross: '✗',
    bullet: '•',
  },

  // Colors for different prompt elements
  colors: {
    primary: 'blue',
    success: 'green',
    error: 'red',
    muted: 'dim',
  },

  // Custom messages
  messages: {
    submit: 'Submitted',
    cancel: 'Cancelled',
    error: 'Error',
    required: 'Required',
  },

  // Default behaviors
  defaults: {
    showCursor: true,
    clearAfterSubmit: true,
    required: true,
  },
})
```

### Per-Prompt Configuration

Each prompt type also accepts specific configuration options:

```ts
import { prompt } from '@stacksjs/clapp'

// Text prompt with custom configuration
const name = await prompt.text('What is your name?', {
  placeholder: 'Enter your full name',
  defaultValue: 'Guest',
  validate: value => value.length > 0 || 'Name cannot be empty',
})

// Select prompt with custom configuration
const option = await prompt.select('Choose an option:', [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
], {
  pointer: '>',
  maxItems: 5,
})
```

## Style Configuration

### Global Style Configuration

Configure the default styling for your CLI:

```ts
import { configStyle } from '@stacksjs/clapp'

configStyle({
  // Enable or disable color output
  colors: true,

  // Use Unicode or ASCII characters
  unicode: true,

  // Theme configuration
  theme: {
    primary: 'blue',
    secondary: 'cyan',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'magenta',
    muted: 'gray',
  },
})
```

### Terminal Capabilities

Clapp can automatically detect terminal capabilities, but you can also configure them manually:

```ts
import { setTerminalCapabilities } from '@stacksjs/clapp'

setTerminalCapabilities({
  // Color support level (0-3)
  colors: 3,

  // Whether the terminal supports Unicode
  unicode: true,

  // Terminal dimensions
  columns: 80,
  rows: 24,

  // Whether interactive mode is supported
  interactive: true,
})
```

## Project Configuration

For more complex CLIs, you can define configuration in a dedicated file:

```ts
// clapp.config.ts
import { defineConfig } from '@stacksjs/clapp/config'

export default defineConfig({
  // CLI application config
  cli: {
    name: 'mycli',
    version: '1.0.0',
    description: 'My awesome CLI application',
  },

  // Commands configuration
  commands: {
    strict: true,
    autoHelp: true,
  },

  // Prompts configuration
  prompts: {
    symbols: {
      pointer: '→',
    },
    colors: {
      primary: 'blue',
    },
  },

  // Style configuration
  style: {
    colors: true,
    theme: {
      primary: 'blue',
    },
  },
})
```

Then import and use this configuration:

```ts
import { cli } from '@stacksjs/clapp'
import config from './clapp.config'

const app = cli(config.cli)
```

## Environment Variables

Clapp respects certain environment variables:

| Variable | Description |
| -------- | ----------- |
| `NO_COLOR` | If set to any value, disables color output |
| `FORCE_COLOR` | If set to `1`, `2`, or `3`, forces color output at the specified level |
| `TERM` | Used to detect terminal capabilities |
| `CI` | If set, automatically adjusts output for CI environments |

Example of using environment variables:

```bash
# Disable color output
NO_COLOR=1 mycli build

# Force color output level 3 (true color)
FORCE_COLOR=3 mycli build
```

## Configuration File Location

By default, Clapp looks for configuration files in the following locations:

1. `clapp.config.js` or `clapp.config.ts` in the current directory
2. `.clapp/config.js` or `.clapp/config.ts` in the current directory
3. `.clapprc.js` or `.clapprc.json` in the current directory
4. `clapp` property in `package.json`

You can also specify a custom configuration file:

```ts
import { cli } from '@stacksjs/clapp'
import { loadConfig } from '@stacksjs/clapp/config'

const config = loadConfig('./path/to/custom-config.js')
const app = cli(config.cli)
```

## Runtime Configuration

You can also update configuration at runtime:

```ts
import { cli, updateConfig } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
})

// Update configuration based on runtime conditions
if (process.env.CI) {
  updateConfig({
    prompts: {
      colors: false,
    },
  })
}

// Continue with CLI setup
// ...
```

This flexible configuration system allows you to customize Clapp to perfectly match your application's needs.
