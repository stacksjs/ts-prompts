import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import color from 'picocolors'
import TextPrompt from '../../src/prompts/text'
import { cursor } from '../../src/utils'
import { MockReadable } from '../mock-readable'
import { MockWritable } from '../mock-writable'

describe('textPrompt', () => {
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
    const instance = new TextPrompt({
      input,
      output,
      render: () => 'foo',
    })
    // leave the promise hanging since we don't want to submit in this test
    instance.prompt()
    expect(output.buffer).toEqual([cursor.hide, 'foo'])
  })

  it('sets default value on finalize if no value', async () => {
    const instance = new TextPrompt({
      input,
      output,
      render: () => 'foo',
      defaultValue: 'bleep bloop',
    })
    const resultPromise = instance.prompt()
    input.emit('keypress', '', { name: 'return' })
    const result = await resultPromise
    expect(result).toEqual('bleep bloop')
  })

  it('keeps value on finalize', async () => {
    const instance = new TextPrompt({
      input,
      output,
      render: () => 'foo',
      defaultValue: 'bleep bloop',
    })
    const resultPromise = instance.prompt()
    input.emit('keypress', 'x', { name: 'x' })
    input.emit('keypress', '', { name: 'return' })
    const result = await resultPromise
    expect(result).toEqual('x')
  })

  describe('cursor', () => {
    it('can get cursor', () => {
      const instance = new TextPrompt({
        input,
        output,
        render: () => 'foo',
      })

      expect(instance.cursor).toEqual(0)
    })
  })

  describe('valueWithCursor', () => {
    it('returns value on submit', () => {
      const instance = new TextPrompt({
        input,
        output,
        render: () => 'foo',
      })
      instance.prompt()
      input.emit('keypress', 'x', { name: 'x' })
      input.emit('keypress', '', { name: 'return' })
      expect(instance.valueWithCursor).toEqual('x')
    })

    it('highlights cursor position', () => {
      const instance = new TextPrompt({
        input,
        output,
        render: () => 'foo',
      })
      instance.prompt()
      const keys = 'foo'
      for (let i = 0; i < keys.length; i++) {
        input.emit('keypress', keys[i], { name: keys[i] })
      }
      input.emit('keypress', 'left', { name: 'left' })
      expect(instance.valueWithCursor).toEqual(`fo${color.inverse('o')}`)
    })

    it('shows cursor at end if beyond value', () => {
      const instance = new TextPrompt({
        input,
        output,
        render: () => 'foo',
      })
      instance.prompt()
      const keys = 'foo'
      for (let i = 0; i < keys.length; i++) {
        input.emit('keypress', keys[i], { name: keys[i] })
      }
      input.emit('keypress', 'right', { name: 'right' })
      expect(instance.valueWithCursor).toEqual('foo█')
    })
  })
})
