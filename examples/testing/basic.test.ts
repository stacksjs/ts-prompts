import { describe, expect, test } from 'bun:test'
import { cli } from '../../src/CLI'
import { testingUtils } from '../../src/index'
// Uncomment to use prompt in the interactive example
// import * as prompts from '../../src/prompts'

const { createTestCLI, execCommand } = testingUtils

describe('Basic CLI Testing', () => {
  test('should execute a simple command', async () => {
    // Create a test CLI instance
    const testCLI = createTestCLI({ name: 'test-cli' })

    // Add a simple command
    testCLI.command('greet')
      .option('-n, --name <name>', 'Name to greet')
      .action(({ name }) => `Hello, ${name || 'world'}!`)

    // Execute the command with options
    const result = await execCommand(testCLI, ['greet', '--name', 'Alice'])

    // Verify the output
    expect(result.stdout).toContain('Hello, Alice!')
    expect(result.exitCode).toBe(0)
  })

  test('should handle command errors', async () => {
    const testCLI = createTestCLI({ name: 'test-cli' })

    testCLI.command('fail')
      .action(() => {
        throw new Error('Command failed')
      })

    const result = await execCommand(testCLI, ['fail'])

    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Command failed')
  })

  test('should show help output', async () => {
    const testCLI = createTestCLI({
      name: 'test-cli',
      version: '1.0.0',
    })

    testCLI
      .help()
      .command('test')
      .description('Run tests')
      .option('-v, --verbose', 'Enable verbose output')

    const result = await execCommand(testCLI, ['--help'])

    expect(result.stdout).toContain('test-cli')
    expect(result.stdout).toContain('test')
    expect(result.exitCode).toBe(0)
  })
})

/*
// Example of testing with interactive prompts
// To run this, uncomment the import at the top of the file
describe('Interactive CLI Testing', () => {
  test('should handle user prompts', async () => {
    const testCLI = createTestCLI({ name: 'interactive-cli' })

    testCLI.command('ask')
      .action(async () => {
        const name = await prompts.text({
          message: 'What is your name?'
        })
        const age = await prompts.number({
          message: 'How old are you?'
        })
        return `Hello, ${name}! You are ${age} years old.`
      })

    const result = await execCommand(testCLI, ['ask'], {
      inputs: ['Alice', '30'],
    })

    expect(result.stdout).toContain('Hello, Alice! You are 30 years old.')
  })
})
*/
