import { Value, SchemaItemType } from './validate.types'

export const isDefined = (value: Value): boolean => typeof value !== undefined
export const isString = (value: Value): boolean => typeof value === 'string'
export const isNumber = (value: Value): boolean => typeof value === 'number'
export const isArray = (value: Value): boolean => Array.isArray(value)

export const minLength = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as string[]

    return array.every((v: string) => minLength(v, conditionValue))
  } else {
    const str = value as string

    return str.length >= conditionValue
  }
}

export const maxLength = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as string[]

    return array.every((v: string) => maxLength(v, conditionValue))
  } else {
    const str = value as string

    return str.length <= conditionValue
  }
}

export const min = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as number[]

    return array.every((v: number) => min(v, conditionValue))
  } else {
    const num = value as number

    return num >= conditionValue
  }
}

export const max = (value: Value, conditionValue: number): boolean => {
  if (isArray(value)) {
    const array = value as number[]

    return array.every((v: number) => max(v, conditionValue))
  } else {
    const num = value as number

    return num <= conditionValue
  }
}

export const checkAdditionalValues = (
  dataKeys: string[],
  schemaKeys: string[]
): boolean => {
  let includesAdditionalValues: boolean[] = []

  dataKeys.forEach((key: string) => {
    const includes = schemaKeys.includes(key)

    if (!includes)
      includesAdditionalValues = [...includesAdditionalValues, !includes]
  })

  return !!includesAdditionalValues.length
}

export const checkRequiredValues = (
  errors: string[],
  values: Array<
    [string, SchemaItemType & { items?: SchemaItemType | undefined }]
  >,
  keys: string[]
): string[] => {
  values.forEach(([key, value]) => {
    const includes = keys.includes(key)

    if (!includes) errors = [...errors, `"${key}" value is required`]
  })

  return errors
}
