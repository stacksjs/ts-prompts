import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import color from 'picocolors'
import {
  confirm,
  group,
  intro,
  isCancel,
  multiselect,
  note,
  outro,
  password,
  select,
  spinner,
  tasks,
  text,
} from './prompts'

interface OnboardingAnswers {
  projectName: string
  description: string
  author: string
  features: string[]
  database: string
  installDeps: boolean
  useTypeORM: boolean
  gitInit: boolean
}

/**
 * Run the Stacks.js onboarding wizard
 */
export async function runStacksOnboarding(): Promise<void> {
  // Intro banner
  intro(color.bgCyan(color.black(' Welcome to Stacks.js - The Modern TypeScript Fullstack Framework ')))

  const defaultProjectName = path.basename(process.cwd())

  try {
    const answers = await group<OnboardingAnswers>(
      {
        projectName: () => {
          const result = text({
            message: 'What is the name of your project?',
            placeholder: defaultProjectName,
            validate: (value) => {
              if (!value)
                return 'Project name is required'
              if (!/^[a-z0-9-_]+$/.test(value)) {
                return 'Project name can only contain lowercase letters, numbers, dashes, and underscores'
              }
              return undefined
            },
          })
          return result as Promise<string | undefined>
        },

        description: ({ results }) => {
          const result = text({
            message: 'Provide a short description of your project:',
            placeholder: `A Stacks.js project named ${results.projectName || defaultProjectName}`,
          })
          return result as Promise<string | undefined>
        },

        author: () => {
          const result = text({
            message: 'Author name:',
            placeholder: 'Your Name',
          })
          return result as Promise<string | undefined>
        },

        features: () => {
          const result = multiselect({
            message: 'Select features to include:',
            required: true,
            options: [
              { value: 'auth', label: 'Authentication', hint: 'User login, registration, and session management' },
              { value: 'api', label: 'REST API', hint: 'RESTful API endpoints with validation' },
              { value: 'graphql', label: 'GraphQL API', hint: 'GraphQL schema and resolvers' },
              { value: 'admin', label: 'Admin Dashboard', hint: 'Vue-based admin interface' },
              { value: 'testing', label: 'Testing Framework', hint: 'Vitest and testing utilities' },
              { value: 'i18n', label: 'Internationalization', hint: 'Multi-language support' },
              { value: 'pwa', label: 'PWA Support', hint: 'Progressive Web App capabilities' },
              { value: 'docker', label: 'Docker', hint: 'Docker setup for development and production' },
            ],
          })
          return result as Promise<string[] | undefined>
        },

        database: () => {
          const result = select({
            message: 'Select your database:',
            options: [
              { value: 'postgres', label: 'PostgreSQL', hint: 'Recommended for production' },
              { value: 'mysql', label: 'MySQL', hint: 'Popular alternative' },
              { value: 'sqlite', label: 'SQLite', hint: 'Good for small projects and local development' },
              { value: 'mongodb', label: 'MongoDB', hint: 'NoSQL database option' },
            ],
          })
          return result as Promise<string | undefined>
        },

        useTypeORM: ({ results }) => {
          if (results.database === 'mongodb') {
            return Promise.resolve(false)
          }
          const result = confirm({
            message: 'Use TypeORM for database access?',
            initialValue: true,
          })
          return result as Promise<boolean | undefined>
        },

        gitInit: () => {
          const result = confirm({
            message: 'Initialize a git repository?',
            initialValue: true,
          })
          return result as Promise<boolean | undefined>
        },

        installDeps: () => {
          const result = confirm({
            message: 'Install dependencies after project creation?',
            initialValue: true,
          })
          return result as Promise<boolean | undefined>
        },
      },
      {
        onCancel: () => {
          outro(color.yellow('Setup canceled. No changes were made.'))
          process.exit(0)
        },
      },
    )

    // Project generation steps
    note(
      `Creating your Stacks.js project with the following configuration:
Project Name: ${color.cyan(answers.projectName)}
Description: ${answers.description}
Database: ${color.cyan(answers.database)}
Features: ${answers.features.map(f => color.cyan(f)).join(', ')}
Use TypeORM: ${answers.useTypeORM ? color.green('Yes') : color.yellow('No')}
`,
      'Project Configuration',
    )

    // Show spinner while "creating" project
    const spin = spinner()
    spin.start('Setting up your Stacks.js project')

    // Execute project creation tasks
    await tasks([
      {
        title: 'Creating project directory structure',
        task: async (message) => {
          message('Creating directory structure...')
          // In a real implementation, this would create the actual directory structure
          await new Promise(resolve => setTimeout(resolve, 500))
          message('Project structure created')
        },
      },
      {
        title: 'Setting up configuration files',
        task: async (message) => {
          message('Generating configuration files...')
          // In a real implementation, this would create config files
          await new Promise(resolve => setTimeout(resolve, 700))
          message('Configuration files created')
        },
      },
      {
        title: 'Setting up database connection',
        task: async (message) => {
          message(`Configuring ${answers.database} connection...`)
          // In a real implementation, this would set up database configs
          await new Promise(resolve => setTimeout(resolve, 600))
          message('Database configuration complete')
        },
      },
      {
        title: 'Installing dependencies',
        enabled: answers.installDeps,
        task: async (message) => {
          message('Installing project dependencies...')
          // In a real implementation, this would run npm/yarn/pnpm install
          await new Promise(resolve => setTimeout(resolve, 2000))
          message('Dependencies installed')
        },
      },
      {
        title: 'Initializing git repository',
        enabled: answers.gitInit,
        task: async (message) => {
          message('Initializing git repository...')
          // In a real implementation, this would run git init
          await new Promise(resolve => setTimeout(resolve, 300))
          message('Git repository initialized')
        },
      },
    ])

    spin.stop('Stacks.js project created successfully!')

    // Final message
    outro(`
${color.green('✓')} Your Stacks.js project is ready!

${color.cyan('Next steps:')}
  ${color.dim('$')} cd ${answers.projectName}
  ${color.dim('$')} npm run dev

${color.cyan('Documentation:')}
  https://stacks.js.org/docs

${color.cyan('Need help?')}
  https://stacks.js.org/community
`)
  }
  catch (err: unknown) {
    if (isCancel(err)) {
      outro(color.yellow('Setup canceled. No changes were made.'))
      return
    }

    outro(color.red(`An error occurred during setup: ${err instanceof Error ? err.message : String(err)}`))
    console.error(err)
  }
}

// For direct execution of this script
if (require.main === module) {
  runStacksOnboarding().catch(console.error)
}
