import { validate } from 'uuid'

type ErrorMessages = string[]

type ValidationResult = {
  isValid: boolean
  message: string
}

type ValidationSchema = {
  [index: string]: {
    validate: (value: string | number | string[]) => boolean
    error: string
    isRequired?: boolean
  }
}

const requiredFields = ['username', 'age', 'hobbies']

const isString = (value: string): boolean => typeof value === 'string'

const isNumber = (value: number): boolean => typeof value === 'number'

const isArray = (value: string[]): boolean => {
  const isValueArray = Array.isArray(value)

  return isValueArray && value.length
    ? value.every((v) => isString(v))
    : isValueArray
}

const validationSchema: ValidationSchema = {
  id: {
    validate: (id): boolean => validate(id as string),
    error: '"id" value should be a valid uuid',
  },
  username: {
    validate: (username) => isString(username as string),
    error: '"username" value should be a string',
    isRequired: true,
  },
  age: {
    validate: (age) => isNumber(age as number) && age >= 0,
    error: '"age" value should be a positive number',
    isRequired: true,
  },
  hobbies: {
    validate: (hobbies) => isArray(hobbies as string[]),
    error: '"hobbies" value should be an array of strings',
    isRequired: true,
  },
}

export default (data: object): ValidationResult => {
  let errors: ErrorMessages = []

  Object.entries(data).forEach(([key, value]) => {
    const isValid = validationSchema[key].validate(value)

    if (!isValid) errors = [...errors, validationSchema[key].error]
    // fix required check
    // if (!requiredFields.includes(key)) errors[key] = 'value is required'
  })

  return { isValid: !errors.length, message: errors.join(', ') }
}
