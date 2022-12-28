export type ErrorMessages = string[]

export type ValidationResult = {
  valid: boolean
  errors?: string
}

export type Value = string | number | string[] | number[] | undefined

export type ValidationMap = {
  [index: string]: (value: Value) => boolean
}

export type SchemaItemType = {
  type: string
  rules?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
  }
  required?: boolean
}

export type ValidationSchema = {
  [index: string]: SchemaItemType & { items?: SchemaItemType }
}
