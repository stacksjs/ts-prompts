import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import color from 'picocolors'
import PasswordPrompt from '../../src/prompts/password'
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
    mock.restore()
  })

  it('renders render() result', () => {
    const instance = new PasswordPrompt({
      input,
      output,
      render: () => 'foo',
    })
    // leave the promise hanging since we don't want to submit in this test
    instance.prompt()
    expect(output.buffer).toEqual([cursor.hide, 'foo'])
  })

  describe('cursor', () => {
    it('can get cursor', () => {
      const instance = new PasswordPrompt({
        input,
        output,
        render: () => 'foo',
      })

      expect(instance.cursor).toEqual(0)
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
      expect(instance.valueWithCursor).toEqual('•••')
    })

    it('renders marker at end', () => {
      const instance = new PasswordPrompt({
        input,
        output,
        render: () => 'foo',
      })
      instance.prompt()
      input.emit('keypress', 'x', { name: 'x' })
      expect(instance.valueWithCursor).toEqual(`•${color.inverse(color.hidden('_'))}`)
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
      expect(instance.valueWithCursor).toEqual(`•${color.inverse('•')}•`)
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
      expect(instance.valueWithCursor).toEqual(`X${color.inverse(color.hidden('_'))}`)
    })
  })
})
