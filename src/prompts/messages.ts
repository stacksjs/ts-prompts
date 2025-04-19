import type { Writable } from 'node:stream'
import type { CommonOptions } from './common'
import process from 'node:process'
import color from 'picocolors'
import { S_BAR, S_BAR_END, S_BAR_START } from './common'

export const cancel: (message: string, opts?: CommonOptions) => void = (message = '', opts?: CommonOptions) => {
  const output: Writable = opts?.output ?? process.stdout
  output.write(`${color.gray(S_BAR_END)}  ${color.red(message)}\n\n`)
}

export const intro: (title: string, opts?: CommonOptions) => void = (title = '', opts?: CommonOptions) => {
  const output: Writable = opts?.output ?? process.stdout
  output.write(`${color.gray(S_BAR_START)}  ${title}\n`)
}

export const outro: (message: string, opts?: CommonOptions) => void = (message = '', opts?: CommonOptions) => {
  const output: Writable = opts?.output ?? process.stdout
  output.write(`${color.gray(S_BAR)}\n${color.gray(S_BAR_END)}  ${message}\n\n`)
}
