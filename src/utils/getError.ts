import { Error } from '../app.types'

export const ERRORS = {
  BAD_REQUEST: 'Bad Request',
  NOT_FOUND: 'Not Found',
}

export const getError = (
  value: string | undefined
): { [index: string]: Error } => ({
  BAD_REQUEST: {
    name: ERRORS.BAD_REQUEST,
    message: `id '${value}' is not a valid uuid value`,
  },
  RECORD_NOT_FOUND: {
    name: 'Not Found',
    message: `record id '${value}' is not found`,
  },
  RESOURSE_NOT_FOUND: {
    name: 'Not Found',
    message: `resource '${value}' is not found`,
  },
})
