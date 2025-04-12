import color from 'picocolors'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TextPrompt from '../../src/core/prompts/text'
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
    vi.restoreAllMocks()
  })

  it('renders render() result', () => {
    const instance = new TextPrompt({
      input,
      output,
      render: () => 'foo',
    })
    // leave the promise hanging since we don't want to submit in this test
    instance.prompt()
    expect(output.buffer).to.deep.equal([cursor.hide, 'foo'])
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
    expect(result).to.equal('bleep bloop')
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
    expect(result).to.equal('x')
  })

  describe('cursor', () => {
    it('can get cursor', () => {
      const instance = new TextPrompt({
        input,
        output,
        render: () => 'foo',
      })

      expect(instance.cursor).to.equal(0)
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
      expect(instance.valueWithCursor).to.equal('x')
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
      expect(instance.valueWithCursor).to.equal(`fo${color.inverse('o')}`)
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
      expect(instance.valueWithCursor).to.equal('foo█')
    })
  })
})
