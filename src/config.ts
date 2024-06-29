import LoggerTransport from './LoggerTransport'
import * as transports from './transports'

export interface Config {
  transports: LoggerTransport[]
}

const config: Config = {
  transports: [
    new transports.ConsoleTransport('info'),
  ],
}

export default config

export function configure(cfg: Partial<Config>) {
  Object.assign(config, cfg)
}