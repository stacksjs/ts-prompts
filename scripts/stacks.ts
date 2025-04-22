#!/usr/bin/env bun
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { cli, style } from '../src'
import {
  confirm,
  log,
  note,
  select,
  text,
} from '../src/prompts'

// Define the main CLI
const stacks = cli('stacks')

stacks.command('create', 'Create a new Stacks project')
  .action(async () => {
    // Prompt for project name
    const name = await text({
      message: 'What is the name of your project?',
      placeholder: 'my-stacks-app',
    })

    if (typeof name === 'symbol')
      return

    // Collect project configuration
    const config: {
      name: string
      ui: boolean
      components: boolean
      webComponents: boolean
      vue: boolean
      views: boolean
      functions: boolean
      api: boolean
      database: boolean
      notifications: boolean
      cache: boolean
      email: boolean
      project: string | null
    } = {
      name: name as string,
      ui: false,
      components: false,
      webComponents: false,
      vue: false,
      views: false,
      functions: false,
      api: false,
      database: false,
      notifications: false,
      cache: false,
      email: false,
      project: null,
    }

    // UI
    const ui = await confirm({
      message: 'Are you building a UI?',
      initialValue: false,
    })

    if (typeof ui === 'symbol')
      return
    config.ui = ui as boolean

    // If UI is true, ask about components, web components, and Vue
    if (config.ui) {
      // Components
      const components = await confirm({
        message: 'Are you building UI components?',
        initialValue: false,
      })

      if (typeof components === 'symbol')
        return
      config.components = components as boolean

      if (config.components) {
        // Web Components
        const webComponents = await confirm({
          message: 'Automagically built optimized custom elements/web components?',
          initialValue: false,
        })

        if (typeof webComponents === 'symbol')
          return
        config.webComponents = webComponents as boolean

        // Vue
        const vue = await confirm({
          message: 'Automagically build a Vue component library?',
          initialValue: false,
        })

        if (typeof vue === 'symbol')
          return
        config.vue = vue as boolean
      }

      // Views
      const views = await confirm({
        message: 'How about views?',
        initialValue: false,
      })

      if (typeof views === 'symbol')
        return
      config.views = views as boolean
    }

    // Functions/composables
    const functions = await confirm({
      message: 'Are you developing functions/composables?',
      initialValue: false,
    })

    if (typeof functions === 'symbol')
      return
    config.functions = functions as boolean

    // API
    const api = await confirm({
      message: 'Are you building an API?',
      initialValue: false,
    })

    if (typeof api === 'symbol')
      return
    config.api = api as boolean

    // Database
    const database = await confirm({
      message: 'Do you need a database?',
      initialValue: false,
    })

    if (typeof database === 'symbol')
      return
    config.database = database as boolean

    // Notifications
    const notifications = await confirm({
      message: 'Do you need notifications? _(e.g. email, SMS, push or chat notifications)_',
      initialValue: false,
    })

    if (typeof notifications === 'symbol')
      return
    config.notifications = notifications as boolean

    // Cache
    const cache = await confirm({
      message: 'Do you need caching?',
      initialValue: false,
    })

    if (typeof cache === 'symbol')
      return
    config.cache = cache as boolean

    // Email
    const email = await confirm({
      message: 'Do you need email?',
      initialValue: false,
    })

    if (typeof email === 'symbol')
      return
    config.email = email as boolean

    // Target specific project
    const setProject = await confirm({
      message: 'Target a specific project?',
      initialValue: false,
    })

    if (typeof setProject === 'symbol')
      return

    if (setProject as boolean) {
      const project = await text({
        message: 'Enter the project name',
        placeholder: 'default',
      })

      if (typeof project === 'symbol')
        return
      config.project = project as string
    }

    // Create project directories and files
    await createProject(config)
  })

async function createProject(config: {
  name: string
  ui: boolean
  components: boolean
  webComponents: boolean
  vue: boolean
  views: boolean
  functions: boolean
  api: boolean
  database: boolean
  notifications: boolean
  cache: boolean
  email: boolean
  project: string | null
}) {
  const projectDir = path.join(process.cwd(), config.name)

  // Create project directory
  log.info(`Creating project directory: ${style.italic(projectDir)}`)

  try {
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true })
    }

    // Create basic project structure
    const directories = [
      'src',
      'public',
      'scripts',
    ]

    // Add conditional directories based on config
    if (config.ui)
      directories.push('src/ui')
    if (config.components)
      directories.push('src/components')
    if (config.views)
      directories.push('src/views')
    if (config.functions)
      directories.push('src/functions')
    if (config.api)
      directories.push('src/api')
    if (config.database)
      directories.push('src/database')

    // Create directories
    for (const dir of directories) {
      fs.mkdirSync(path.join(projectDir, dir), { recursive: true })
    }

    // Create package.json with typed dependencies and devDependencies
    interface PackageJson {
      name: string
      version: string
      private: boolean
      description: string
      scripts: {
        [key: string]: string
      }
      dependencies: {
        [key: string]: string
      }
      devDependencies: {
        [key: string]: string
      }
    }

    const packageJson: PackageJson = {
      name: config.name,
      version: '0.1.0',
      private: true,
      description: `A Stacks project: ${config.name}`,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {},
      devDependencies: {
        vite: '^5.0.0',
        typescript: '^5.0.0',
      },
    }

    // Add dependencies based on config
    if (config.webComponents) {
      packageJson.dependencies.lit = '^3.0.0'
    }

    if (config.vue) {
      packageJson.dependencies.vue = '^3.3.0'
      packageJson.devDependencies['@vitejs/plugin-vue'] = '^5.0.0'
    }

    if (config.api) {
      packageJson.dependencies.express = '^4.18.0'
    }

    if (config.database) {
      packageJson.dependencies.prisma = '^5.0.0'
      packageJson.devDependencies['@prisma/client'] = '^5.0.0'
    }

    if (config.notifications || config.email) {
      packageJson.dependencies.nodemailer = '^6.9.0'
    }

    if (config.cache) {
      packageJson.dependencies.redis = '^4.6.0'
    }

    // Write package.json
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
    )

    // Create README.md
    const readme = `# ${config.name}

A Stacks project with the following features:

${config.ui ? '- UI\n' : ''}${config.components ? '- Components\n' : ''}${config.webComponents ? '- Web Components\n' : ''}${config.vue ? '- Vue Component Library\n' : ''}${config.views ? '- Views\n' : ''}${config.functions ? '- Functions/Composables\n' : ''}${config.api ? '- API\n' : ''}${config.database ? '- Database\n' : ''}${config.notifications ? '- Notifications\n' : ''}${config.cache ? '- Cache\n' : ''}${config.email ? '- Email\n' : ''}${config.project ? `- Project: ${config.project}\n` : ''}

## Getting Started

\`\`\`bash
cd ${config.name}
npm install
npm run dev
\`\`\`
`

    fs.writeFileSync(path.join(projectDir, 'README.md'), readme)

    // Create index.html if UI is enabled
    if (config.ui) {
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`

      fs.writeFileSync(path.join(projectDir, 'index.html'), indexHtml)

      // Create main.ts
      let mainTs = ''

      if (config.vue) {
        mainTs = `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`
        // Create App.vue
        const appVue = `<template>
  <div class="app">
    <header>
      <h1>${config.name}</h1>
    </header>
    <main>
      <p>Welcome to your new Stacks project!</p>
    </main>
  </div>
</template>

<style>
.app {
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
`
        fs.writeFileSync(path.join(projectDir, 'src', 'App.vue'), appVue)

        // Create vite.config.ts for Vue
        const viteConfig = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
`
        fs.writeFileSync(path.join(projectDir, 'vite.config.ts'), viteConfig)
      }
      else {
        mainTs = `// Initialize your app here
const app = document.querySelector('#app')

if (app) {
  app.innerHTML = '<h1>${config.name}</h1><p>Welcome to your new Stacks project!</p>'
}
`
      }

      fs.writeFileSync(path.join(projectDir, 'src', 'main.ts'), mainTs)
    }

    // Create tsconfig.json
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        module: 'ESNext',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        skipLibCheck: true,

        /* Bundler mode */
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,

        /* Linting */
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
    }

    fs.writeFileSync(
      path.join(projectDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
    )

    // Create API sample if enabled
    if (config.api) {
      const apiIndexTs = `import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the ${config.name} API' })
})

app.listen(port, () => {
  console.log(\`API server running at http://localhost:\${port}\`)
})
`
      fs.writeFileSync(path.join(projectDir, 'src', 'api', 'index.ts'), apiIndexTs)
    }

    // Create database setup if enabled
    if (config.database) {
      const prismaSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Define your models here
`
      // Create prisma directory
      fs.mkdirSync(path.join(projectDir, 'prisma'), { recursive: true })
      fs.writeFileSync(path.join(projectDir, 'prisma', 'schema.prisma'), prismaSchema)

      // Create .env file for database URL
      fs.writeFileSync(
        path.join(projectDir, '.env'),
        'DATABASE_URL="file:./dev.db"\n',
      )
    }

    log.success(`
Project ${config.name} created successfully!

To get started:
  cd ${config.name}
  npm install
  ${config.database ? 'npx prisma generate\n  ' : ''}npm run dev
`)
  }
  catch (error: any) {
    log.error(`Failed to create project: ${error.message}`)
  }
}

// Parse the command line arguments and run the CLI
stacks.help()
stacks.parse()
