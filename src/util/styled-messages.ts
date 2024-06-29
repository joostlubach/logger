import { Message, StyledMessage } from '../types'

export function isStyledMessage(message: Message): message is StyledMessage {
  return typeof message !== 'string'
}

export function stripStyles(message: Message): string {
  if (isStyledMessage(message)) {
    return message.text
  } else {
    return message
  }
}