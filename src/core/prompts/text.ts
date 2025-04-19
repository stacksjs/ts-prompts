import type { PromptOptions } from './prompt'
import color from 'picocolors'
import Prompt from './prompt'

interface TextOptions extends PromptOptions<TextPrompt> {
  placeholder?: string
  defaultValue?: string
}

export default class TextPrompt extends Prompt {
  get valueWithCursor(): string {
    if (this.state === 'submit') {
      return this.value
    }

    if (this.cursor >= this.value.length) {
      return `${this.value}█`
    }

    const s1 = this.value.slice(0, this.cursor)
    const [s2, ...s3] = this.value.slice(this.cursor)
    return `${s1}${color.inverse(s2)}${s3.join('')}`
  }

  get cursor(): number {
    return this._cursor
  }

  constructor(opts: TextOptions) {
    super(opts)

    this.on('finalize', () => {
      if (!this.value) {
        this.value = opts.defaultValue
      }
    })
  }
}
