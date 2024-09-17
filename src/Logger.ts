import config from './config'
import { Details, LogLevel, Message } from './types'
import { flattenDetails } from './util/details'

export default class Logger {

  constructor(tag: string) {
    this.tag = tag
  }

  public tag: string

  //------
  // Static interface

  public static debug(tag: string, message: Message, ...details: Details) {
    new this(tag).debug(message, details)
  }

  public static info(tag: string, message: Message, ...details: Details) {
    new this(tag).info(message, details)
  }

  public static warning(tag: string, message: Message, ...details: Details) {
    new this(tag).warning(message, details)
  }

  public static error(tag: string, message: Message, ...details: Details) {
    new this(tag).error(message, details)
  }

  //------
  // Interface

  public debug(message: Message, ...details: Details) {
    this.log('debug', message, details)
  }

  public info(message: Message, ...details: Details) {
    this.log('info', message, details)
  }

  public warning(message: Message, ...details: Details) {
    this.log('warning', message, details)
  }

  public error(message: Message, ...details: Details) {
    this.log('error', message, details)
  }

  //------
  // Log

  public log(level: LogLevel, message: Message, details: Details = []) {
    const flattenedDetails = flattenDetails(details).map(value => {
      for (const serializer of config.valueSerializers) {
        if (serializer.check(value)) {
          return serializer.serialize(value)
        } else {
          return value
        }
      }
    })

    for (const transport of config.transports) {
      if (!transport.shouldLog(level)) { continue }
      transport.log(this.tag, level, message, flattenedDetails)
    }
  }

}