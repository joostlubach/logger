import { Details, LogLevel, Message } from './types'

export default abstract class LoggerTransport {

  constructor(
    public level: LogLevel,
  ) {}

  public shouldLog(level: LogLevel) {
    return this.numericLevel(level) >= this.numericLevel(this.level)
  }

  private numericLevel(level: LogLevel) {
    switch (level) {
    case 'debug': return 1
    case 'info': return 2
    case 'warning': return 3
    case 'error': return 4
    }
  }

  public abstract log(tag: string, level: LogLevel, message: Message, details: Details): void

}
