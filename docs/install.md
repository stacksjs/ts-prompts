# Installation

Installing `clapp` is easy. You can add it to your project as a dependency and start building beautiful CLI applications.

## Installing as a Dependency

Add clapp to your existing project using your preferred package manager:

::: code-group

```bash [bun]
# Install using Bun (recommended)
bun add @stacksjs/clapp

# Or as a development dependency
bun add -d @stacksjs/clapp
```

```bash [npm]
# Install using npm
npm install @stacksjs/clapp

# Or as a development dependency
npm install --save-dev @stacksjs/clapp
```

```bash [pnpm]
# Install using pnpm
pnpm add @stacksjs/clapp

# Or as a development dependency
pnpm add -D @stacksjs/clapp
```

```bash [yarn]
# Install using Yarn
yarn add @stacksjs/clapp

# Or as a development dependency
yarn add -D @stacksjs/clapp
```

:::

## Global Installation

You can also install clapp globally to use its CLI features across all your projects:

::: code-group

```bash [bun]
# Install globally using Bun
bun add -g @stacksjs/clapp
```

```bash [npm]
# Install globally using npm
npm install -g @stacksjs/clapp
```

```bash [pnpm]
# Install globally using pnpm
pnpm add -g @stacksjs/clapp
```

```bash [yarn]
# Install globally using Yarn
yarn global add @stacksjs/clapp
```

:::

## Requirements

- [Bun](https://bun.sh/) 1.0.0 or higher
- Node.js 18.x or higher (if not using Bun)

## Verifying Installation

After installation, you can verify that clapp is working correctly:

```bash
# If installed globally
clapp --version

# If installed locally
bunx clapp --version
```

This should display the current version of clapp.

## Basic Project Setup

After installing clapp, you can create a new project structure manually:

```bash
mkdir my-cli-app
cd my-cli-app

# Initialize a new package
bun init

# Install clapp
bun add @stacksjs/clapp
```

Create your main CLI file (`src/index.ts`):

```ts
import { cli, command } from '@stacksjs/clapp'

// Create your CLI application
const app = cli({
  name: 'my-cli',
  version: '0.1.0',
  description: 'My awesome CLI application',
})

// Add commands
command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello, world!')
  })

// Run your CLI
app.run()
```

Update your `package.json` to include the build and start scripts:

```json
{
  "scripts": {
    "build": "bun build ./src/index.ts --outfile ./dist/cli.js",
    "start": "bun run ./dist/cli.js"
  }
}
```

This will get you started with a basic clapp project. For more advanced usage, refer to the other sections of the documentation.
