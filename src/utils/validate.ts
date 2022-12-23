import { validate } from 'uuid'

type ErrorMessages = string[]

type ValidationResult = {
  valid: boolean
  message: string
}

type Value = string | number | string[] | number[]

type ValidationMap = {
  [index: string]: (value: Value) => boolean
}

type SchemaItemType = {
  type: string
  rules?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
  required?: boolean
}

type ValidationSchema = {
  [index: string]: SchemaItemType & { items?: SchemaItemType }
}

const isString = (value: Value): boolean => typeof value === 'string'
const isNumber = (value: Value): boolean => typeof value === 'number'
const isArray = (value: Value): boolean => Array.isArray(value)

const minLength = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as string[]

    return array.every((v: string) => minLength(v, conditionValue))
  } else {
    const str = value as string

    return str.length >= conditionValue
  }
}
const maxLength = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as string[]

    return array.every((v: string) => maxLength(v, conditionValue))
  } else {
    const str = value as string

    return str.length <= conditionValue
  }
}
const min = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as number[]

    return array.every((v: number) => min(v, conditionValue))
  } else {
    const num = value

    return num >= conditionValue
  }
}
const max = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as number[]

    return array.every((v: number) => max(v, conditionValue))
  } else {
    const num = value

    return num <= conditionValue
  }
}

const validationMap: ValidationMap = {
  string: isString,
  number: isNumber,
  array: isArray,
}

export const validateId = (id: string | undefined): ValidationResult => {
  return {
    valid: validate(id as string),
    message: '"id" value should be a valid uuid',
  }
}

// primitive validation schema tool
export const validateBody = (
  data: object,
  schema: ValidationSchema
): ValidationResult => {
  let errors: ErrorMessages = []

  const dataKeys = Object.keys(data)
  const schemaEntries = Object.entries(schema)
  const requiredFields = schemaEntries.filter(([key, value]) => !value.required)

  requiredFields.forEach(([key, value]) => {
    const includes = dataKeys.includes(key)

    if (!includes) errors = [...errors, `"${key}" value is required`]
  })

  const dataEntries = Object.entries(data)

  dataEntries.forEach(([key, value]) => {
    const type = schema[key].type
    const rules = schema[key].rules
    const validType = validationMap[type](value)

    if (!validType) {
      errors = [...errors, `"${key}" value must be a type of ${type}`]
    }

    if (
      type === 'string' &&
      rules?.minLength &&
      !minLength(value, rules.minLength)
    ) {
      errors = [
        ...errors,
        `"${key}" value must be longer then ${rules.minLength} chars`,
      ]
    }

    if (
      type === 'string' &&
      rules?.maxLength &&
      !maxLength(value, rules.maxLength)
    ) {
      errors = [
        ...errors,
        `"${key}" value must be less then ${rules.maxLength} chars`,
      ]
    }

    if (type === 'number' && rules?.min && !min(value, rules.min)) {
      errors = [...errors, `"${key}" value must be more then ${rules.min}`]
    }

    if (type === 'number' && rules?.max && !max(value, rules.max)) {
      errors = [...errors, `"${key}" value must be less then ${rules.max}`]
    }

    if (type === 'array' && value.length) {
      const type = schema[key].items?.type as string
      const rules = schema[key].items?.rules
      const validType = value.every((v: string) => validationMap[type](v))

      if (!validType) {
        errors = [
          ...errors,
          `items of "${key}" value must be a type of ${type}`,
        ]
      }

      if (
        type === 'string' &&
        rules?.minLength &&
        !minLength(value, rules.minLength)
      ) {
        errors = [
          ...errors,
          `items of "${key}" value must be longer then ${rules.minLength} chars`,
        ]
      }

      if (
        type === 'string' &&
        rules?.maxLength &&
        !maxLength(value, rules.maxLength)
      ) {
        errors = [
          ...errors,
          `items of "${key}" value must be less then ${rules.maxLength} chars`,
        ]
      }

      if (type === 'number' && rules?.min && !min(value, rules.min)) {
        errors = [
          ...errors,
          `items of "${key}" value must be more then ${rules.min}`,
        ]
      }

      if (type === 'number' && rules?.max && !max(value, rules.max)) {
        errors = [
          ...errors,
          `items of "${key}" value must be less then ${rules.max}`,
        ]
      }
    }
  })

  return { valid: !errors.length, message: errors.join(', ') }
}
