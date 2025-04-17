import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import ConfirmPrompt from '../../src/prompts/confirm'
import { cursor } from '../../src/utils'
import { MockReadable } from '../mock-readable'
import { MockWritable } from '../mock-writable'

describe('confirmPrompt', () => {
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
    const instance = new ConfirmPrompt({
      input,
      output,
      render: () => 'foo',
      active: 'yes',
      inactive: 'no',
    })
    instance.prompt()
    expect(output.buffer).toEqual([cursor.hide, 'foo'])
  })

  it('sets value and submits on confirm (y)', () => {
    const instance = new ConfirmPrompt({
      input,
      output,
      render: () => 'foo',
      active: 'yes',
      inactive: 'no',
      initialValue: true,
    })

    instance.prompt()
    input.emit('keypress', 'y', { name: 'y' })

    expect(instance.value).toEqual(true)
    expect(instance.state).toEqual('submit')
  })

  it('sets value and submits on confirm (n)', () => {
    const instance = new ConfirmPrompt({
      input,
      output,
      render: () => 'foo',
      active: 'yes',
      inactive: 'no',
      initialValue: true,
    })

    instance.prompt()
    input.emit('keypress', 'n', { name: 'n' })

    expect(instance.value).toEqual(false)
    expect(instance.state).toEqual('submit')
  })

  describe('cursor', () => {
    it('cursor is 1 when inactive', () => {
      const instance = new ConfirmPrompt({
        input,
        output,
        render: () => 'foo',
        active: 'yes',
        inactive: 'no',
        initialValue: false,
      })

      instance.prompt()
      input.emit('keypress', '', { name: 'return' })
      expect(instance.cursor).toEqual(1)
    })

    it('cursor is 0 when active', () => {
      const instance = new ConfirmPrompt({
        input,
        output,
        render: () => 'foo',
        active: 'yes',
        inactive: 'no',
        initialValue: true,
      })

      instance.prompt()
      input.emit('keypress', '', { name: 'return' })
      expect(instance.cursor).toEqual(0)
    })
  })
})
