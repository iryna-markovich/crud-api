export const noAdditinalValuesMessage = (keys: string[]): string =>
  `additional values are not allowed, allowed only: ${keys.join(', ')} `.trim()

export const typeMessage = (
  errors: string[],
  key: string,
  valueType: string,
  type: 'single' | 'multi'
): string[] => {
  const baseMessage = `"${key}" value must be a type of ${valueType}`
  const message = type === 'multi' ? `items of ${baseMessage}` : baseMessage

  return [...errors, message]
}

export const minLengthMessage = (
  errors: string[],
  key: string,
  minLength: number,
  type: 'single' | 'multi'
): string[] => {
  const baseMessage = `"${key}" value must be longer then ${minLength} chars`
  const message = type === 'multi' ? `items of ${baseMessage}` : baseMessage

  return [...errors, message]
}

export const maxLengthMessage = (
  errors: string[],
  key: string,
  maxLength: number,
  type: 'single' | 'multi'
): string[] => {
  const baseMessage = `"${key}" value must be less then ${maxLength} chars`
  const message = type === 'multi' ? `items of ${baseMessage}` : baseMessage

  return [...errors, message]
}

export const minMessage = (
  errors: string[],
  key: string,
  min: number,
  type: 'single' | 'multi'
): string[] => {
  const baseMessage = `"${key}" value must be more then ${min}`
  const message = type === 'multi' ? `items of ${baseMessage}` : baseMessage

  return [...errors, message]
}

export const maxMessage = (
  errors: string[],
  key: string,
  max: number,
  type: 'single' | 'multi'
): string[] => {
  const baseMessage = `"${key}" value must be less then ${max}`
  const message = type === 'multi' ? `items of ${baseMessage}` : baseMessage

  return [...errors, message]
}
