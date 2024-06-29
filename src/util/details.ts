import { isArray } from 'lodash'
import { Details } from '../types'

export function flattenDetails(details: Details): Details {
  const flattened: Details = []

  const flatten = (details: Details) => {
    if (isArray(details)) {
      details.forEach(flatten)
    } else {
      flattened.push(details)
    }
  }

  flatten(details)
  return flattened
}