# Testing API Reference

Clapp provides built-in testing utilities to make it easier to test your CLI applications. These utilities help you simulate command executions, capture outputs, and verify the expected behavior of your commands.

## Testing Setup

### `createTestCLI(options)`

Creates a test instance of a CLI application, enabling isolated testing without side effects.

```ts
import { createTestCLI } from '@stacksjs/clapp/testing'

// Create a test CLI instance
const testCLI = createTestCLI({
  name: 'test-cli',
  version: '1.0.0',
})

// Add commands and options
testCLI.command('greet')
  .option('-n, --name <name>', 'Name to greet')
  .action(({ name }) => `Hello, ${name || 'world'}!`)
```

#### Options

The `createTestCLI` function accepts the same options as the regular `cli` function.

### `setupTest(cli)`

Prepares a CLI instance for testing by disabling process exits and redirecting outputs.

```ts
import { cli } from '@stacksjs/clapp'
import { setupTest } from '@stacksjs/clapp/testing'

// Create a regular CLI instance
const myCLI = cli({
  name: 'my-cli',
  version: '1.0.0',
})

// Setup the CLI for testing
const testContext = setupTest(myCLI)
```

## Test Execution

### `execCommand(cli, argv, options?)`

Executes a command on the CLI instance and returns the result.

```ts
import { execCommand } from '@stacksjs/clapp/testing'

// Execute a command
const result = await execCommand(testCLI, ['greet', '--name', 'Alice'])

// Verify the output
expect(result.stdout).toContain('Hello, Alice!')
expect(result.exitCode).toBe(0)
```

#### Options

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `inputs` | `string[]` | Array of inputs to provide to prompts | `[]` |
| `env` | `Record<string, string>` | Environment variables to set during execution | `{}` |
| `cwd` | `string` | Working directory for the command | `process.cwd()` |
| `timeout` | `number` | Maximum time (ms) to wait for command completion | `5000` |

#### Return Value

| Property | Type | Description |
| -------- | ---- | ----------- |
| `stdout` | `string` | Standard output content |
| `stderr` | `string` | Standard error content |
| `exitCode` | `number` | Exit code of the command |
| `duration` | `number` | Time taken to execute (ms) |
| `outputs` | `string[]` | All output chunks |
| `result` | `any` | Return value from the action function |

### `mockPrompt(responses)`

Mocks user responses to interactive prompts.

```ts
import { mockPrompt } from '@stacksjs/clapp/testing'

// Mock user responses for prompts
mockPrompt({
  // Respond to specific prompts
  'What is your name?': 'Alice',
  'Confirm action?': true,

  // Or use patterns
  '/password/i': 'secret123',

  // Or use defaults for all unconfigured prompts
  '*': 'default response',
})

// Execute a command with interactive prompts
const result = await execCommand(testCLI, ['interactive'])
```

## Output Inspection

### `captureOutput()`

Captures all output during test execution.

```ts
import { captureOutput } from '@stacksjs/clapp/testing'

// Start capturing output
const capture = captureOutput()

// Run some code that generates output
await testCLI.run(['greet', '--name', 'Bob'])

// Stop capturing and get results
const output = capture.stop()

// Verify outputs
expect(output.stdout).toContain('Hello, Bob!')
expect(output.stderr).toBeEmpty()
```

### `getLastOutput()`

Gets the most recent output from the test CLI.

```ts
import { getLastOutput } from '@stacksjs/clapp/testing'

// Execute a command
await testCLI.run(['greet', '--name', 'Charlie'])

// Get the last output
const lastOutput = getLastOutput()

// Verify the output
expect(lastOutput).toContain('Hello, Charlie!')
```

## Integration with Testing Frameworks

### Jest Integration

```ts
import { createTestCLI, execCommand } from '@stacksjs/clapp/testing'

describe('CLI Application', () => {
  let testCLI

  beforeEach(() => {
    testCLI = createTestCLI({
      name: 'test-cli',
      version: '1.0.0',
    })

    testCLI.command('greet')
      .option('-n, --name <name>', 'Name to greet')
      .action(({ name }) => `Hello, ${name || 'world'}!`)
  })

  test('greet command with name', async () => {
    const result = await execCommand(testCLI, ['greet', '--name', 'Alice'])
    expect(result.stdout).toContain('Hello, Alice!')
    expect(result.exitCode).toBe(0)
  })

  test('greet command without name', async () => {
    const result = await execCommand(testCLI, ['greet'])
    expect(result.stdout).toContain('Hello, world!')
    expect(result.exitCode).toBe(0)
  })
})
```

### Vitest Integration

```ts
import { createTestCLI, execCommand } from '@stacksjs/clapp/testing'
import { beforeEach, describe, expect, it } from 'vitest'

describe('CLI Application', () => {
  let testCLI

  beforeEach(() => {
    testCLI = createTestCLI({
      name: 'test-cli',
      version: '1.0.0',
    })

    testCLI.command('greet')
      .option('-n, --name <name>', 'Name to greet')
      .action(({ name }) => `Hello, ${name || 'world'}!`)
  })

  it('greet command with name', async () => {
    const result = await execCommand(testCLI, ['greet', '--name', 'Alice'])
    expect(result.stdout).includes('Hello, Alice!')
    expect(result.exitCode).toBe(0)
  })

  it('greet command without name', async () => {
    const result = await execCommand(testCLI, ['greet'])
    expect(result.stdout).includes('Hello, world!')
    expect(result.exitCode).toBe(0)
  })
})
```

## Testing Prompts

### Testing Interactive Commands

```ts
import { prompt } from '@stacksjs/clapp'
import { createTestCLI, execCommand } from '@stacksjs/clapp/testing'

// Create a CLI with interactive prompts
const testCLI = createTestCLI({
  name: 'test-cli',
  version: '1.0.0',
})

testCLI.command('interactive')
  .action(async () => {
    const name = await prompt.text('What is your name?')
    const age = await prompt.number('How old are you?')
    const confirm = await prompt.confirm('Proceed?')

    if (confirm)
      return `Hello, ${name}! You are ${age} years old.`
    else
      return 'Operation cancelled'
  })

// Test with simulated inputs
const result = await execCommand(testCLI, ['interactive'], {
  inputs: ['Alice', '30', 'y'],
})

expect(result.stdout).toContain('Hello, Alice! You are 30 years old.')
```

## Testing Filesystem Operations

```ts
import fs from 'node:fs/promises'
import path from 'node:path'
import { cleanupTestFS, createTestCLI, createTestFS, execCommand } from '@stacksjs/clapp/testing'

describe('File operations', () => {
  let testDir
  let testCLI

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = await createTestFS({
      'config.json': JSON.stringify({ name: 'test' }),
      'src/': {
        'index.js': 'console.log("Hello")',
      },
    })

    // Create a CLI that manipulates files
    testCLI = createTestCLI({
      name: 'file-cli',
      version: '1.0.0',
    })

    testCLI.command('read <file>')
      .action(async ({ file }) => {
        const content = await fs.readFile(path.join(testDir, file), 'utf-8')
        return content
      })
  })

  afterEach(async () => {
    // Clean up the test directory
    await cleanupTestFS(testDir)
  })

  test('read command should read file content', async () => {
    const result = await execCommand(testCLI, ['read', 'config.json'], {
      cwd: testDir,
    })

    expect(result.stdout).toContain('{"name":"test"}')
    expect(result.exitCode).toBe(0)
  })
})
```

## Advanced Testing

### Testing Exit Codes

```ts
import { createTestCLI, execCommand } from '@stacksjs/clapp/testing'

const testCLI = createTestCLI({
  name: 'test-cli',
})

testCLI.command('succeed')
  .action(() => {
    return { success: true }
  })

testCLI.command('fail')
  .action(() => {
    throw new Error('Command failed')
  })

// Test success case
const successResult = await execCommand(testCLI, ['succeed'])
expect(successResult.exitCode).toBe(0)

// Test failure case
const failResult = await execCommand(testCLI, ['fail'])
expect(failResult.exitCode).toBe(1)
expect(failResult.stderr).toContain('Command failed')
```

### Testing Help Output

```ts
import { createTestCLI, execCommand } from '@stacksjs/clapp/testing'

const testCLI = createTestCLI({
  name: 'test-cli',
  version: '1.0.0',
  description: 'Test CLI application',
})

testCLI.command('test')
  .description('Run tests')
  .option('-v, --verbose', 'Enable verbose output')
  .action(() => {})

// Test main help
const helpResult = await execCommand(testCLI, ['--help'])
expect(helpResult.stdout).toContain('Test CLI application')
expect(helpResult.stdout).toContain('test')

// Test command help
const commandHelpResult = await execCommand(testCLI, ['test', '--help'])
expect(commandHelpResult.stdout).toContain('Run tests')
expect(commandHelpResult.stdout).toContain('--verbose')
```

### Testing with Timers

```ts
import { createTestCLI, execCommand } from '@stacksjs/clapp/testing'

const testCLI = createTestCLI({
  name: 'test-cli',
})

testCLI.command('delayed')
  .action(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return 'Done after delay'
  })

// Test with timeout
await expect(async () => {
  await execCommand(testCLI, ['delayed'], { timeout: 500 })
}).rejects.toThrow('Command execution timed out')

// Test with sufficient timeout
const result = await execCommand(testCLI, ['delayed'], { timeout: 2000 })
expect(result.stdout).toContain('Done after delay')
expect(result.duration).toBeGreaterThanOrEqual(1000)
```
