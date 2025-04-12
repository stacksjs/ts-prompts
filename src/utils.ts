import process from 'node:process'

// Thank you to
//  https://github.com/sindresorhus/is-unicode-supported/blob/main/index.js
export function isUnicodeSupported(): boolean {
  const { env } = process
  const { TERM, TERM_PROGRAM } = env

  if (process.platform !== 'win32') {
    return TERM !== 'linux' // Linux console (kernel)
  }

  return Boolean(env.WT_SESSION) // Windows Terminal
    || Boolean(env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
    || env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
    || TERM_PROGRAM === 'Terminus-Sublime'
    || TERM_PROGRAM === 'vscode'
    || TERM === 'xterm-256color'
    || TERM === 'alacritty'
    || TERM === 'rxvt-unicode'
    || TERM === 'rxvt-unicode-256color'
    || env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
}

// thanks to sisteransi
export const ESC: string = '\x1B'
export const CSI: string = `${ESC}[`
export const beep: string = '\u0007'

export interface Cursor {
  to: (x: number, y: number) => string
  move: (x: number, y: number) => string
  up: (count?: number) => string
  down: (count?: number) => string
  forward: (count?: number) => string
  backward: (count?: number) => string
  nextLine: (count?: number) => string
  prevLine: (count?: number) => string
  left: string
  hide: string
  show: string
  save: string
  restore: string
}
export const cursor: Cursor = {
  to(x, y) {
    if (!y)
      return `${CSI}${x + 1}G`
    return `${CSI}${y + 1};${x + 1}H`
  },
  move(x, y) {
    let ret = ''

    if (x < 0)
      ret += `${CSI}${-x}D`
    else if (x > 0)
      ret += `${CSI}${x}C`

    if (y < 0)
      ret += `${CSI}${-y}A`
    else if (y > 0)
      ret += `${CSI}${y}B`

    return ret
  },
  up: (count = 1) => `${CSI}${count}A`,
  down: (count = 1) => `${CSI}${count}B`,
  forward: (count = 1) => `${CSI}${count}C`,
  backward: (count = 1) => `${CSI}${count}D`,
  nextLine: (count = 1) => `${CSI}E`.repeat(count),
  prevLine: (count = 1) => `${CSI}F`.repeat(count),
  left: `${CSI}G`,
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`,
  save: `${ESC}7`,
  restore: `${ESC}8`,
}

export interface Scroll {
  up: (count?: number) => string
  down: (count?: number) => string
}
export const scroll: Scroll = {
  up: (count = 1) => `${CSI}S`.repeat(count),
  down: (count = 1) => `${CSI}T`.repeat(count),
}

export interface Erase {
  screen: string
  up: (count?: number) => string
  down: (count?: number) => string
  line: string
  lineEnd: string
  lineStart: string
  lines: (count: number) => string
}
export const erase: Erase = {
  screen: `${CSI}2J`,
  up: (count = 1) => `${CSI}1J`.repeat(count),
  down: (count = 1) => `${CSI}J`.repeat(count),
  line: `${CSI}2K`,
  lineEnd: `${CSI}K`,
  lineStart: `${CSI}1K`,
  lines(count) {
    let clear = ''
    for (let i = 0; i < count; i++)
      clear += this.line + (i < count - 1 ? cursor.up() : '')
    if (count)
      clear += cursor.left
    return clear
  },
}

export interface Clear {
  screen: string
}
export const clear: Clear = {
  screen: `${ESC}c`,
}
