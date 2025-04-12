import color from 'picocolors'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PasswordPrompt from '../../src/core/prompts/password'
import { cursor } from '../../src/utils'
import { MockReadable } from '../mock-readable'
import { MockWritable } from '../mock-writable'

describe('passwordPrompt', () => {
  let input: MockReadable
  let output: MockWritable

  beforeEach(() => {
    input = new MockReadable()
    output = new MockWritable()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders render() result', () => {
    const instance = new PasswordPrompt({
      input,
      output,
      render: () => 'foo',
    })
    // leave the promise hanging since we don't want to submit in this test
    instance.prompt()
    expect(output.buffer).to.deep.equal([cursor.hide, 'foo'])
  })

  describe('cursor', () => {
    it('can get cursor', () => {
      const instance = new PasswordPrompt({
        input,
        output,
        render: () => 'foo',
      })

      expect(instance.cursor).to.equal(0)
    })
  })

  describe('valueWithCursor', () => {
    it('returns masked value on submit', () => {
      const instance = new PasswordPrompt({
        input,
        output,
        render: () => 'foo',
      })
      instance.prompt()
      const keys = 'foo'
      for (let i = 0; i < keys.length; i++) {
        input.emit('keypress', keys[i], { name: keys[i] })
      }
      input.emit('keypress', '', { name: 'return' })
      expect(instance.valueWithCursor).to.equal('•••')
    })

    it('renders marker at end', () => {
      const instance = new PasswordPrompt({
        input,
        output,
        render: () => 'foo',
      })
      instance.prompt()
      input.emit('keypress', 'x', { name: 'x' })
      expect(instance.valueWithCursor).to.equal(`•${color.inverse(color.hidden('_'))}`)
    })

    it('renders cursor inside value', () => {
      const instance = new PasswordPrompt({
        input,
        output,
        render: () => 'foo',
      })
      instance.prompt()
      input.emit('keypress', 'x', { name: 'x' })
      input.emit('keypress', 'y', { name: 'y' })
      input.emit('keypress', 'z', { name: 'z' })
      input.emit('keypress', 'left', { name: 'left' })
      input.emit('keypress', 'left', { name: 'left' })
      expect(instance.valueWithCursor).to.equal(`•${color.inverse('•')}•`)
    })

    it('renders custom mask', () => {
      const instance = new PasswordPrompt({
        input,
        output,
        render: () => 'foo',
        mask: 'X',
      })
      instance.prompt()
      input.emit('keypress', 'x', { name: 'x' })
      expect(instance.valueWithCursor).to.equal(`X${color.inverse(color.hidden('_'))}`)
    })
  })
})
