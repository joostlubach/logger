export type LogLevel = 'debug' | 'info' | 'warning' | 'error'

export type Message = string | StyledMessage
export interface StyledMessage {
  text:   string
  styles: Styles[]
}

export type Details = any[]

export interface Styles {
  [key: string]: string
}

export interface LoggerTransport {
  log(level: LogLevel, message: Message, details: Details): void
}