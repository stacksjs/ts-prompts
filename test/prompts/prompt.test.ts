import { afterEach, beforeEach, describe, expect, it, vi } from 'bun:test'
import Prompt from '../../src/core/prompts/prompt'
import { isCancel } from '../../src/core/utils/index'
import { cursor } from '../../src/utils'
import { MockReadable } from '../mock-readable'
import { MockWritable } from '../mock-writable'

describe('prompt', () => {
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
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })
    // leave the promise hanging since we don't want to submit in this test
    instance.prompt()
    expect(output.buffer).toEqual([cursor.hide, 'foo'])
  })

  it('submits on return key', async () => {
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })
    const resultPromise = instance.prompt()
    input.emit('keypress', '', { name: 'return' })
    const result = await resultPromise
    expect(result).toEqual('')
    expect(isCancel(result)).toEqual(false)
    expect(instance.state).toEqual('submit')
    expect(output.buffer).toEqual([cursor.hide, 'foo', '\n', cursor.show])
  })

  it('cancels on ctrl-c', async () => {
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })
    const resultPromise = instance.prompt()
    input.emit('keypress', '\x03', { name: 'c' })
    const result = await resultPromise
    expect(isCancel(result)).toEqual(true)
    expect(instance.state).toEqual('cancel')
    expect(output.buffer).toEqual([cursor.hide, 'foo', '\n', cursor.show])
  })

  it('writes initialValue to value', () => {
    const eventSpy = vi.fn()
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
      initialValue: 'bananas',
    })
    instance.on('value', eventSpy)
    instance.prompt()
    expect(instance.value).toEqual('bananas')
    expect(eventSpy).toHaveBeenCalled()
  })

  it('re-renders on resize', () => {
    const renderFn = vi.fn().mockImplementation(() => 'foo')
    const instance = new Prompt({
      input,
      output,
      render: renderFn,
    })
    instance.prompt()

    expect(renderFn).toHaveBeenCalledTimes(1)

    output.emit('resize')

    expect(renderFn).toHaveBeenCalledTimes(2)
  })

  it('state is active after first render', async () => {
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })

    expect(instance.state).toEqual('initial')

    instance.prompt()

    expect(instance.state).to.equal('active')
  })

  it('emits truthy confirm on y press', () => {
    const eventFn = vi.fn()
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })

    instance.on('confirm', eventFn)

    instance.prompt()

    input.emit('keypress', 'y', { name: 'y' })

    expect(eventFn).toBeCalledWith(true)
  })

  it('emits falsey confirm on n press', () => {
    const eventFn = vi.fn()
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })

    instance.on('confirm', eventFn)

    instance.prompt()

    input.emit('keypress', 'n', { name: 'n' })

    expect(eventFn).toBeCalledWith(false)
  })

  it('sets value as placeholder on tab if one is set', () => {
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
      placeholder: 'piwa',
    })

    instance.prompt()

    input.emit('keypress', '\t', { name: 'tab' })

    expect(instance.value).toEqual('piwa')
  })

  it('does not set placeholder value on tab if value already set', () => {
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
      placeholder: 'piwa',
      initialValue: 'trzy',
    })

    instance.prompt()

    input.emit('keypress', '\t', { name: 'tab' })

    expect(instance.value).toEqual('trzy')
  })

  it('emits key event for unknown chars', () => {
    const eventSpy = vi.fn()
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })

    instance.on('key', eventSpy)

    instance.prompt()

    input.emit('keypress', 'z', { name: 'z' })

    expect(eventSpy).toBeCalledWith('z')
  })

  it('emits cursor events for movement keys', () => {
    const keys = ['up', 'down', 'left', 'right']
    const eventSpy = vi.fn()
    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
    })

    instance.on('cursor', eventSpy)

    instance.prompt()

    for (const key of keys) {
      input.emit('keypress', key, { name: key })
      expect(eventSpy).toBeCalledWith(key)
    }
  })

  it('emits cursor events for movement key aliases when not tracking', () => {
    const keys = [
      ['k', 'up'],
      ['j', 'down'],
      ['h', 'left'],
      ['l', 'right'],
    ]
    const eventSpy = vi.fn()
    const instance = new Prompt(
      {
        input,
        output,
        render: () => 'foo',
      },
      false,
    )

    instance.on('cursor', eventSpy)

    instance.prompt()

    for (const [alias, key] of keys) {
      input.emit('keypress', alias, { name: alias })
      expect(eventSpy).toBeCalledWith(key)
    }
  })

  it('aborts on abort signal', () => {
    const abortController = new AbortController()

    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
      signal: abortController.signal,
    })

    instance.prompt()

    expect(instance.state).toEqual('active')

    abortController.abort()

    expect(instance.state).toEqual('cancel')
  })

  it('returns immediately if signal is already aborted', () => {
    const abortController = new AbortController()
    abortController.abort()

    const instance = new Prompt({
      input,
      output,
      render: () => 'foo',
      signal: abortController.signal,
    })
    instance.prompt()

    expect(instance.state).toEqual('cancel')
  })
})
