# Validation API Reference

Clapp provides a robust validation system to verify command-line arguments and options before your command is executed. This helps ensure that your CLI receives correctly formatted inputs and provides helpful error messages to users when validation fails.

## Basic Validation

### Using Type Annotations

The simplest form of validation is through TypeScript type annotations:

```ts
import { cli } from '@stacksjs/clapp'

const app = cli({
  name: 'my-cli',
  version: '1.0.0',
})

app.command('greet')
  .option('-n, --name <name>', 'Name to greet')
  .option('-a, --age <age>', 'Age of the person', { type: 'number' })
  .action(({ name, age }) => {
    console.log(`Hello, ${name}! You are ${age} years old.`)
  })
```

Built-in type validators include:

- `string` (default)
- `number`
- `boolean`
- `array`
- `object`

## Advanced Validation

### Option Validators

For more complex validation, you can provide a custom validator function:

```ts
import { cli } from '@stacksjs/clapp'

const app = cli({
  name: 'my-cli',
  version: '1.0.0',
})

app.command('process')
  .option('-p, --port <port>', 'Port number', {
    type: 'number',
    validate: (port) => {
      if (port < 1024 || port > 65535)
        throw new Error('Port must be between 1024 and 65535')
      return true
    },
  })
  .action(({ port }) => {
    console.log(`Starting server on port ${port}`)
  })
```

### Command Argument Validators

You can also validate command arguments:

```ts
import { cli } from '@stacksjs/clapp'

const app = cli({
  name: 'file-cli',
  version: '1.0.0',
})

app.command('read <filename>')
  .validate((args) => {
    const { filename } = args
    if (!filename.endsWith('.txt') && !filename.endsWith('.md'))
      throw new Error('Only .txt and .md files are supported')
    return true
  })
  .action(({ filename }) => {
    console.log(`Reading file: ${filename}`)
  })
```

## Validation Helpers

Clapp provides built-in validation helpers to make common validations easier:

### `isRequired`

Ensures that a value is provided and not empty:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { isRequired } = validators

const app = cli({
  name: 'deploy-cli',
  version: '1.0.0',
})

app.command('deploy')
  .option('-e, --environment <env>', 'Deployment environment', {
    validate: isRequired('Environment is required'),
  })
  .action(({ environment }) => {
    console.log(`Deploying to ${environment}`)
  })
```

### `isOneOf`

Validates that a value is one of a predefined set of options:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { isOneOf } = validators

const app = cli({
  name: 'deploy-cli',
  version: '1.0.0',
})

app.command('deploy')
  .option('-e, --environment <env>', 'Deployment environment', {
    validate: isOneOf(['dev', 'staging', 'prod'], 'Invalid environment'),
  })
  .action(({ environment }) => {
    console.log(`Deploying to ${environment}`)
  })
```

### `isNumber`

Validates that a value is a number within specified ranges:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { isNumber } = validators

const app = cli({
  name: 'scale-cli',
  version: '1.0.0',
})

app.command('scale')
  .option('-i, --instances <num>', 'Number of instances', {
    type: 'number',
    validate: isNumber({ min: 1, max: 100 }, 'Instances must be between 1 and 100'),
  })
  .action(({ instances }) => {
    console.log(`Scaling to ${instances} instances`)
  })
```

### `matchesPattern`

Validates that a value matches a regular expression pattern:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { matchesPattern } = validators

const app = cli({
  name: 'user-cli',
  version: '1.0.0',
})

app.command('create')
  .option('-e, --email <email>', 'User email', {
    validate: matchesPattern(
      /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      'Invalid email format'
    ),
  })
  .action(({ email }) => {
    console.log(`Creating user with email: ${email}`)
  })
```

### `isFileOrFolder`

Validates that a value represents an existing file or folder:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { isFileOrFolder } = validators

const app = cli({
  name: 'file-cli',
  version: '1.0.0',
})

app.command('process <path>')
  .validate({
    path: isFileOrFolder({ mustExist: true }, 'File or folder must exist'),
  })
  .action(({ path }) => {
    console.log(`Processing: ${path}`)
  })
```

## Combined Validators

You can combine multiple validators using the `combine` helper:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { combine, isRequired, isNumber } = validators

const app = cli({
  name: 'deploy-cli',
  version: '1.0.0',
})

app.command('deploy')
  .option('-p, --port <port>', 'Port number', {
    type: 'number',
    validate: combine([
      isRequired('Port is required'),
      isNumber({ min: 1024, max: 65535 }, 'Port must be between 1024 and 65535'),
    ]),
  })
  .action(({ port }) => {
    console.log(`Deploying on port ${port}`)
  })
```

## Custom Validation Rules

### Creating Reusable Validators

You can create your own reusable validators:

```ts
import { cli, createValidator } from '@stacksjs/clapp'

// Custom validator function
const isGitUrl = createValidator((value) => {
  if (!value.startsWith('git@') && !value.startsWith('https://') && !value.endsWith('.git'))
    throw new Error('Invalid Git URL format')
  return true
}, 'Invalid Git URL')

const app = cli({
  name: 'git-cli',
  version: '1.0.0',
})

app.command('clone <url>')
  .validate({
    url: isGitUrl,
  })
  .action(({ url }) => {
    console.log(`Cloning from: ${url}`)
  })
```

### Asynchronous Validation

You can also perform asynchronous validation:

```ts
import fs from 'node:fs/promises'
import { cli, createAsyncValidator } from '@stacksjs/clapp'

// Async validator that checks if a port is already in use
const isPortAvailable = createAsyncValidator(async (port) => {
  // Simplified example - in a real app, you'd check if the port is in use
  const blockedPorts = await fs.readFile('blocked-ports.txt', 'utf-8')
    .then(content => content.split('\n').map(Number))
    .catch(() => [])

  if (blockedPorts.includes(Number(port)))
    throw new Error(`Port ${port} is already in use`)

  return true
}, 'Port is not available')

const app = cli({
  name: 'server-cli',
  version: '1.0.0',
})

app.command('start')
  .option('-p, --port <port>', 'Port number', {
    type: 'number',
    validate: isPortAvailable,
  })
  .action(async ({ port }) => {
    console.log(`Starting server on port ${port}`)
  })
```

## Error Handling

### Custom Error Messages

You can provide custom error messages for validation failures:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { isNumber } = validators

const app = cli({
  name: 'timeout-cli',
  version: '1.0.0',
})

app.command('wait')
  .option('-t, --timeout <seconds>', 'Timeout in seconds', {
    type: 'number',
    validate: isNumber(
      { min: 1, max: 300 },
      value => `Timeout must be between 1 and 300 seconds, got: ${value}`
    ),
  })
  .action(({ timeout }) => {
    console.log(`Waiting for ${timeout} seconds`)
  })
```

### Validation Context

You can access the validation context to create validators that depend on other options:

```ts
import { cli, createValidator } from '@stacksjs/clapp'

const app = cli({
  name: 'deploy-cli',
  version: '1.0.0',
})

app.command('deploy')
  .option('-e, --environment <env>', 'Deployment environment')
  .option('-k, --api-key <key>', 'API key', {
    validate: createValidator((value, context) => {
      const env = context.options.environment

      if (env === 'prod' && (!value || value.length < 32))
        throw new Error('Production deployments require a valid API key (min 32 chars)')

      return true
    }),
  })
  .action(({ environment, apiKey }) => {
    console.log(`Deploying to ${environment} with API key: ${apiKey}`)
  })
```

## Conditional Validation

### Validating Based on Command Flags

You can conditionally apply validation based on other options:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { isRequired, when } = validators

const app = cli({
  name: 'auth-cli',
  version: '1.0.0',
})

app.command('login')
  .option('--token <token>', 'Authentication token')
  .option('--username <username>', 'Username', {
    validate: when(
      ctx => !ctx.options.token,
      isRequired('Username is required when token is not provided')
    ),
  })
  .option('--password <password>', 'Password', {
    validate: when(
      ctx => !ctx.options.token,
      isRequired('Password is required when token is not provided')
    ),
  })
  .action(({ token, username, password }) => {
    if (token)
      console.log('Logging in with token')
    else
      console.log(`Logging in as ${username}`)
  })
```

## Validation Schema

### Defining a Complete Validation Schema

For complex commands, you can define a complete validation schema:

```ts
import { cli, validators } from '@stacksjs/clapp'
const { isRequired, isNumber, isOneOf } = validators

const app = cli({
  name: 'deploy-cli',
  version: '1.0.0',
})

app.command('deploy <projectName>')
  .option('-e, --environment <env>', 'Deployment environment')
  .option('-i, --instances <num>', 'Number of instances', { type: 'number' })
  .option('-m, --mode <mode>', 'Deployment mode')
  .validateSchema({
    projectName: isRequired('Project name is required'),
    options: {
      environment: isOneOf(['dev', 'staging', 'prod'], 'Invalid environment'),
      instances: isNumber({ min: 1, max: 10 }, 'Instances must be between 1 and 10'),
      mode: isOneOf(['fast', 'safe'], 'Mode must be either "fast" or "safe"'),
    },
  })
  .action(({ projectName, environment, instances, mode }) => {
    console.log(`Deploying ${projectName} to ${environment} with ${instances} instances in ${mode} mode`)
  })
```

## Interactive Validation

### Validating Prompt Inputs

You can also validate user inputs in interactive prompts:

```ts
import { cli, prompt, validators } from '@stacksjs/clapp'
const { isRequired, isNumber } = validators

const app = cli({
  name: 'interactive-cli',
  version: '1.0.0',
})

app.command('setup')
  .action(async () => {
    const projectName = await prompt.text('Project name?', {
      validate: isRequired('Project name is required'),
    })

    const port = await prompt.number('Port number?', {
      validate: isNumber({ min: 1024, max: 65535 }, 'Port must be between 1024 and 65535'),
      default: 3000,
    })

    const environment = await prompt.select('Environment?', {
      options: ['dev', 'staging', 'prod'],
    })

    console.log(`Setting up ${projectName} on port ${port} for ${environment}`)
  })
```
