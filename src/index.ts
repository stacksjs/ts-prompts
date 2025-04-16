import CLI from './CLI'
import Command from './Command'

/**
 * @param name The program name to display in help and version message
 */
export const cli = (name = ''): CLI => new CLI(name)

export { CLI, Command }

export * from '../scripts/stacks-onboarding'
export * from './core'
export * from './prompts'
export * from './types'
export * from './utils'

export default cli
