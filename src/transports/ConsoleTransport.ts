/* eslint-disable no-console */

import { isPlainObject, kebabCase } from 'lodash'
import { MethodKey, stringHash } from 'ytil'
import LoggerTransport from '../LoggerTransport'
import { Details, LogLevel, Message, Styles } from '../types'
import { isStyledMessage } from '../util'

export default class ConsoleTransport extends LoggerTransport {

  constructor(
    level: LogLevel,
    options: Partial<ConsoleTransportOptions> = {},
  ) {
    super(level)

    this.options = {
      detailed: true,
      ...options,
    }
  }

  public readonly options: ConsoleTransportOptions

  public log(tag: string, level: LogLevel, message: Message, details: Details) {
    const args = this.formatMessage(tag, level, message)

    if (details.length === 0 || !this.options.detailed) {
      // Just log the formatted message.
      this._console('log', ...args)
    } else if (console.groupCollapsed instanceof Function) {
      // Use the group feature to log the details.
      this._console('groupCollapsed', ...args)
      this.logDetails(details)
      this._console('groupEnd')
    } else {
      this._console('log', ...args)
      this.logDetails(details)
    }
  }

  protected logDetails(details: Details) {
    if (details instanceof Array) {
      details.forEach(this.logDetail.bind(this))
    } else if (isPlainObject(details)) {
      for (const [key, value] of Object.entries(details)) {
        this._console('log', `%c${key}:`, 'font-weight: bold;')
        this.logDetail(value)
      }
    } else {
      this.logDetail(details)
    }
  }

  private logDetail(detail: any) {
    if (isPlainObject(detail) && detail.text != null && detail.style != null) {
      this._console('log', ...this.formatDetail(detail.text, detail.style))
    } else {
      this._console('log', detail)
    }
  }

  private _console<K extends MethodKey<typeof console>>(key: K, ...args: any[]) {
    queueMicrotask(console[key].bind(console, ...args))
  }

  protected formatMessage(tag: string, level: LogLevel, message: Message): string[] {
    const styles = []
    if (isStyledMessage(message)) {
      styles.push(...message.styles)
      message = message.text
    }

    if (!(console.group instanceof Function)) {
      // No coloring is supported either.
      return [`[${tag}] ${level.toUpperCase()}: ${message}`]
    } else {
      return [
        `%c${tag}%c %c${message}`,
        `display: inline-block; vertical-align: baseline; border-radius: 2px; background: ${this.tagColor(tag)}; padding: 0px 2px; color: #000; font-weight: bold;`,
        '',
        ...styles.length === 0 ? [dumpStyles(this.stylesForLevel(level))] : [],
        ...styles.map(style => `font-weight: normal; ${dumpStyles({...this.stylesForLevel(level), ...style})}`),
      ]
    }
  }

  protected formatDetail(text: string, style: string): string[] {
    if (!(console.group instanceof Function)) {
      // No coloring is supported either.
      return [text]
    } else {
      return [`%c${text}`, style]
    }
  }

  protected stylesForLevel(level: LogLevel): Styles {
    switch (level) {
    case 'debug': return {color: '#9CCFE6'}
    case 'info': return {color: '#3887D3'}
    case 'warning': return {backgroundColor: 'yellow'}
    case 'error': return {color: 'red'}
    default: return {}
    }
  }

  protected tagColor(tag: string) {
    const seed = stringHash(tag)
    return `hsl(${seed % 360}, 100%, 80%)`
  }

}

export interface ConsoleTransportOptions {
  detailed: boolean
}

function dumpStyles(styles: Styles): string {
  const clauses = []
  for (const key of Object.keys(styles)) {
    clauses.push(`${kebabCase(key)}: ${styles[key]}`)
  }
  return clauses.join(';')
}
