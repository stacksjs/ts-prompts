# Building Binaries

This guide covers how to build standalone binary executables from your clapp applications, making them easier to distribute and run on different platforms.

## Why Build Binaries?

Building binaries offers several advantages:

- **No Dependencies**: Users don't need to install Node.js or Bun
- **Simpler Distribution**: Single-file executables are easier to distribute
- **Better Performance**: Optimized binaries can start up faster
- **Cross-Platform**: Build for multiple operating systems from one codebase

## Prerequisites

Before building binaries, ensure you have:

- A working clapp application
- Bun installed (version 1.0.0 or later)
- Your project's dependencies installed

## Basic Binary Build

### Setting Up Your Project

First, make sure your project has a clear entry point:

```ts
// src/index.ts
import { cli, command } from '@stacksjs/clapp'

// Create CLI application
const app = cli({
  name: 'mycli',
  version: '1.0.0',
  description: 'My CLI application',
})

// Add commands
command('hello')
  .description('Say hello')
  .argument('[name]', 'Name to greet', 'world')
  .action((name) => {
    console.log(`Hello, ${name}!`)
  })

// Run the CLI
app.run()
```

### Configure Build Scripts

Add build scripts to your `package.json`:

```json
{
  "name": "mycli",
  "version": "1.0.0",
  "scripts": {
    "build": "bun build ./src/index.ts --outfile ./dist/cli.js",
    "build:bin": "bun build:bin"
  },
  "dependencies": {
    "@stacksjs/clapp": "^1.0.0"
  },
  "devDependencies": {
    "bun-types": "latest"
  }
}
```

### Building Your Binary

Run the build command:

```bash
bun run build:bin
```

This will create a binary in the `dist` directory.

## Advanced Binary Configuration

For more control over the binary build process, create a build configuration file:

```ts
// build.config.ts
import { defineConfig } from '@stacksjs/clapp/build'

export default defineConfig({
  // Entry point of your CLI application
  entry: './src/index.ts',

  // Output configuration
  output: {
    // Output directory
    dir: './dist',
    // Binary name (without extension)
    name: 'mycli',
    // Minify output
    minify: true,
  },

  // Target platforms
  targets: [
    'linux-x64',
    'darwin-x64',
    'darwin-arm64',
    'win-x64',
  ],

  // Resource files to include
  resources: [
    './templates/**/*',
    './config.json',
  ],

  // Package information
  pkg: {
    name: 'mycli',
    version: '1.0.0',
    description: 'My CLI application',
    author: 'Your Name',
    license: 'MIT',
  },
})
```

Then run the build with the configuration:

```bash
bun run build:bin --config build.config.ts
```

## Platform-Specific Builds

### Building for Multiple Platforms

To build for multiple platforms at once:

```bash
bun run build:bin --targets linux-x64,darwin-x64,win-x64
```

### Configuring Platform-Specific Behavior

You can include platform-specific code using runtime checks:

```ts
import { command, getPlatform } from '@stacksjs/clapp'

command('open')
  .description('Open a file or URL')
  .argument('<target>', 'File or URL to open')
  .action((target) => {
    const platform = getPlatform()

    let openCommand

    switch (platform) {
      case 'darwin':
        openCommand = `open "${target}"`
        break
      case 'win32':
        openCommand = `start "" "${target}"`
        break
      case 'linux':
        openCommand = `xdg-open "${target}"`
        break
      default:
        console.error('Unsupported platform')
        return
    }

    // Execute the command
    console.log(`Opening ${target}`)
    // Implementation...
  })
```

## Optimizing Binary Size

Large binaries can be unwieldy. Here are tips for optimization:

### Tree Shaking

Ensure you only import what you need:

```ts
// Good - specific imports
import { command, prompt } from '@stacksjs/clapp'

// Avoid - importing everything
// import * as clapp from '@stacksjs/clapp'
```

### Exclude Development Dependencies

In your build configuration, exclude dev dependencies:

```ts
// build.config.ts
export default defineConfig({
  // ...other config

  // Exclude development dependencies
  external: ['typescript', 'jest', 'eslint'],
})
```

### Compression Options

Use compression options:

```ts
// build.config.ts
export default defineConfig({
  // ...other config

  output: {
    // ...output config
    compress: true,
    compressionLevel: 9, // Maximum compression
  },
})
```

## Including External Resources

Your CLI might need access to external files:

### Static Resources

Include static resources in your binary:

```ts
// build.config.ts
export default defineConfig({
  // ...other config

  resources: [
    // Templates directory
    './templates/**/*',
    // Configuration files
    './config/**/*.json',
    // Assets
    './assets/**/*',
  ],
})
```

### Accessing Resources in Code

Access these resources in your code:

```ts
import { fs, getResourcePath } from '@stacksjs/clapp'

command('init')
  .description('Initialize a new project')
  .action(() => {
    // Get path to a bundled resource
    const templatePath = getResourcePath('templates/default.js')

    // Read the template
    const template = fs.readFileSync(templatePath, 'utf8')

    // Use the template
    console.log('Creating project from template...')
    fs.writeFileSync('./project.js', template)
  })
```

## Auto-updating Binaries

You can implement auto-updating capabilities:

```ts
import { checkForUpdates, cli, command } from '@stacksjs/clapp'

const app = cli({
  name: 'mycli',
  version: '1.0.0',
})

// Check for updates on startup
app.beforeRun(async () => {
  const update = await checkForUpdates({
    currentVersion: '1.0.0',
    packageName: 'mycli',
    registry: 'https://registry.npmjs.org',
  })

  if (update.available) {
    console.log(`Update available: ${update.latest}`)
    console.log(`Run 'npm install -g mycli' to update`)
  }
})

// Run your CLI app
app.run()
```

## Distributing Your Binary

Once you've built your binaries, you need to distribute them:

### GitHub Releases

Package your binaries for GitHub releases:

```ts
// release.config.ts
export default {
  // Create a release for each platform
  artifacts: [
    {
      name: 'mycli-linux-x64.tar.gz',
      files: ['dist/mycli-linux-x64'],
      compress: 'tar.gz',
    },
    {
      name: 'mycli-macos-x64.tar.gz',
      files: ['dist/mycli-darwin-x64'],
      compress: 'tar.gz',
    },
    {
      name: 'mycli-macos-arm64.tar.gz',
      files: ['dist/mycli-darwin-arm64'],
      compress: 'tar.gz',
    },
    {
      name: 'mycli-win-x64.zip',
      files: ['dist/mycli-win-x64.exe'],
      compress: 'zip',
    },
  ],
}
```

### NPM Distribution

You can also distribute your CLI via npm:

```json
{
  "name": "mycli",
  "version": "1.0.0",
  "bin": {
    "mycli": "./dist/cli.js"
  },
  "files": [
    "dist/cli.js"
  ],
  "scripts": {
    "prepublishOnly": "bun run build"
  }
}
```

## Testing Binaries

Always test your binaries before distribution:

```ts
import { execFileSync } from 'node:child_process'
import * as path from 'node:path'

// Test script (test/binary.test.ts)
describe('Binary Tests', () => {
  const binaryPath = path.resolve(__dirname, '../dist/mycli')

  test('Version command works', () => {
    const output = execFileSync(binaryPath, ['--version'], { encoding: 'utf8' })
    expect(output.trim()).toBe('1.0.0')
  })

  test('Hello command works', () => {
    const output = execFileSync(binaryPath, ['hello', 'tester'], { encoding: 'utf8' })
    expect(output.trim()).toBe('Hello, tester!')
  })
})
```

### Testing Without Building

You can test your CLI application locally without building a binary by creating a simple executable script:

```bash
#!/usr/bin/env bun
import('./bin/cli')
```

Save this as an executable file (e.g., `mycli`) in your project root, then:

```bash
# Make it executable
chmod +x ./mycli

# Run it directly
./mycli command [options]
```

This approach lets you quickly test your CLI during development without going through the build process. The script simply imports and runs your CLI's entry point file.

For example, if your CLI entry point is at `./src/index.ts`, your script would be:

```bash
#!/usr/bin/env bun
import('./src/index.ts')
```

This is especially useful during development to test command behavior and output formatting.

## Troubleshooting Binary Issues

Common issues and solutions:

### Missing Dependencies

If your binary is missing dependencies, include them in your build:

```ts
// build.config.ts
export default defineConfig({
  // ...other config

  // Include these modules in the binary
  noExternal: ['node-fetch', 'chalk'],
})
```

### PATH Issues

Ensure your binary is available in the PATH by adding installation instructions:

```bash
# For macOS/Linux
chmod +x ./mycli
sudo mv ./mycli /usr/local/bin/

# For Windows
# Add the binary location to your PATH environment variable
```

### Permissions Issues

Set proper permissions for your binary:

```bash
chmod +x ./mycli
```

For more information about building and distributing binaries, refer to the [API Reference](../api/cli) section.
