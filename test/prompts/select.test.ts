import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'
import SelectPrompt from '../../src/prompts/select'
import { cursor } from '../../src/utils'
import { MockReadable } from '../mock-readable'
import { MockWritable } from '../mock-writable'

describe('selectPrompt', () => {
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
    const instance = new SelectPrompt({
      input,
      output,
      render: () => 'foo',
      options: [{ value: 'foo' }, { value: 'bar' }],
    })
    instance.prompt()
    expect(output.buffer).toEqual([cursor.hide, 'foo'])
  })

  describe('cursor', () => {
    it('cursor is index of selected item', () => {
      const instance = new SelectPrompt({
        input,
        output,
        render: () => 'foo',
        options: [{ value: 'foo' }, { value: 'bar' }],
      })

      instance.prompt()

      expect(instance.cursor).toEqual(0)
      input.emit('keypress', 'down', { name: 'down' })
      expect(instance.cursor).toEqual(1)
    })

    it('cursor loops around', () => {
      const instance = new SelectPrompt({
        input,
        output,
        render: () => 'foo',
        options: [{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }],
      })

      instance.prompt()

      expect(instance.cursor).toEqual(0)
      input.emit('keypress', 'up', { name: 'up' })
      expect(instance.cursor).toEqual(2)
      input.emit('keypress', 'down', { name: 'down' })
      expect(instance.cursor).toEqual(0)
    })

    it('left behaves as up', () => {
      const instance = new SelectPrompt({
        input,
        output,
        render: () => 'foo',
        options: [{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }],
      })

      instance.prompt()

      input.emit('keypress', 'left', { name: 'left' })
      expect(instance.cursor).toEqual(2)
    })

    it('right behaves as down', () => {
      const instance = new SelectPrompt({
        input,
        output,
        render: () => 'foo',
        options: [{ value: 'foo' }, { value: 'bar' }],
      })

      instance.prompt()

      input.emit('keypress', 'left', { name: 'left' })
      expect(instance.cursor).toEqual(1)
    })

    it('initial value is selected', () => {
      const instance = new SelectPrompt({
        input,
        output,
        render: () => 'foo',
        options: [{ value: 'foo' }, { value: 'bar' }],
        initialValue: 'bar',
      })
      instance.prompt()
      expect(instance.cursor).toEqual(1)
    })
  })
})
