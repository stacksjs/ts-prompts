import { CLI, cli } from './CLI'
import Command from './Command'

export { CLI, cli, Command }

export * from '../scripts/stacks-onboarding'
export * from './prompts'

export { default as ConfirmPrompt } from './prompts/confirm'
export { default as GroupMultiSelectPrompt } from './prompts/group-multiselect'
export { default as MultiSelectPrompt } from './prompts/multi-select'
export { default as PasswordPrompt } from './prompts/password'
export { default as Prompt } from './prompts/prompt'
export { default as SelectPrompt } from './prompts/select'
export { default as SelectKeyPrompt } from './prompts/select-key'
export { default as TextPrompt } from './prompts/text'
export { block, isCancel } from './runtimes/utils/index'
export type { Settings } from './runtimes/utils/settings'
export { settings, updateSettings } from './runtimes/utils/settings'

// Also export testing utilities directly
export {
  captureOutput,
  cleanupTestFS,
  createTestCLI,
  createTestFS,
  execCommand,
  getLastOutput,
  mockPrompt,
  resetMockPrompts,
  setupTest,
  teardownTest,
} from './testing'

export type { PromptState } from './types'

export * from './utils'

export default cli
