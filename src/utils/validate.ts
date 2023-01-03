import { validate } from 'uuid'
import {
  ValidationMap,
  ValidationSchema,
  ValidationResult,
  ErrorMessages,
} from './validate.types'
import {
  isString,
  isNumber,
  isArray,
  isDefined,
  checkAdditionalValues,
  checkRequiredValues,
  min,
  max,
  maxLength,
  minLength,
} from './helpers'
import {
  noAdditinalValuesMessage,
  typeMessage,
  minLengthMessage,
  maxLengthMessage,
  minMessage,
  maxMessage,
} from './messages'

const validationMap: ValidationMap = {
  string: isString,
  number: isNumber,
  array: isArray,
}

export const validateId = (id: string | undefined): ValidationResult => {
  const valid = validate(id as string)

  return {
    valid: validate(id as string),
    errors: !valid ? '"id" value should be a valid uuid' : undefined,
  }
}

// primitive validation schema tool
export const validateBody = (
  data: object,
  schema: ValidationSchema
): ValidationResult => {
  let errors: ErrorMessages = []

  const dataKeys = Object.keys(data)
  const schemaKeys = Object.keys(schema)
  const schemaEntries = Object.entries(schema)
  const dataEntries = Object.entries(data)
  const requiredValues = schemaEntries.filter(([key, value]) => value.required)

  const includesAdditionalValues = checkAdditionalValues(dataKeys, schemaKeys)

  if (includesAdditionalValues)
    return {
      valid: false,
      errors: [noAdditinalValuesMessage(schemaKeys)].join(', '),
    }

  errors = checkRequiredValues(errors, requiredValues, dataKeys)

  dataEntries.forEach(([key, value]) => {
    const type = schema[key].type as string
    const rules = schema[key].rules
    const validType = validationMap[type](value)

    if (!validType) errors = typeMessage(errors, key, type, 'single')
    else {
      if (type === 'string') {
        const minValue = rules?.minLength as number
        const maxValue = rules?.maxLength as number

        if (minValue && !minLength(value, minValue))
          errors = minLengthMessage(errors, key, minValue, 'single')

        if (maxValue && !maxLength(value, maxValue))
          errors = maxLengthMessage(errors, key, maxValue, 'single')
      }

      if (type === 'number') {
        const minValue = rules?.min as number
        const maxValue = rules?.max as number

        if (isDefined(minValue) && !min(value, minValue))
          errors = minMessage(errors, key, minValue, 'single')

        if (isDefined(maxValue) && !max(value, maxValue))
          errors = maxMessage(errors, key, maxValue, 'single')
      }

      if (type === 'array' && value.length) {
        const type = schema[key].items?.type as string
        const rules = schema[key].items?.rules
        const validType = value.every((v: string) => validationMap[type](v))

        if (!validType) errors = typeMessage(errors, key, type, 'multi')
        else {
          if (type === 'string') {
            const minValue = rules?.minLength as number
            const maxValue = rules?.maxLength as number

            if (minValue && !minLength(value, minValue))
              errors = minLengthMessage(errors, key, minValue, 'multi')

            if (maxValue && !maxLength(value, maxValue))
              errors = maxLengthMessage(errors, key, maxValue, 'multi')
          }

          if (type === 'number') {
            const minValue = rules?.min as number
            const maxValue = rules?.max as number

            if (isDefined(minValue) && !min(value, minValue))
              errors = minMessage(errors, key, minValue, 'multi')

            if (isDefined(maxValue) && !max(value, maxValue))
              errors = maxMessage(errors, key, maxValue, 'multi')
          }
        }
      }
    }
  })

  return {
    valid: !errors.length,
    errors: errors.length ? errors.join(', ') : undefined,
  }
}
