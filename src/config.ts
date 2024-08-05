import { isFunction } from 'lodash'
import LoggerTransport from './LoggerTransport'
import * as transports from './transports'
import { LogLevel } from './types'

const enabled = (() => {
  // Client-side? Always enabled.
  if (typeof process === 'undefined' || typeof process.env === 'undefined') { return true }

  // Testing? Disabled unless explicitly enabled.
  if (nodeEnv() === 'test') {
    return !!process.env.LOG
  }

  // Otherwise, enabled.
  return true
})()

export interface Config {
  transports: LoggerTransport[]
}

const config: Config = {
  transports: enabled ? [
    new transports.ConsoleTransport(defaultLogLevel()),
  ] : [],
}

function defaultLogLevel(): LogLevel {
  const levelFromEnv = typeof process !== 'undefined'
    ? (process.env.LOG ?? 'info')
    : 'info'

  if (['debug', 'info', 'warning', 'error'].includes(levelFromEnv)) {
    return levelFromEnv as LogLevel
  } else {
    return 'info'
  }
}

function nodeEnv() {
  try {
    return process.env.NODE_ENV ?? 'production'
  } catch {
    // Should have been statically replaced by Vite, OR injected by Webpack, but if both are
    // not done, there's no way to get it. Default to production.
    return 'production'
  }
}

export default config

export function configure(cfg: Partial<Config> | ((config: Config) => void)) {
  if (isFunction(cfg)) {
    cfg(config)
  } else {
    Object.assign(config, cfg)
  }
}
