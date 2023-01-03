export const validationSchema = {
  username: {
    type: 'string',
    rules: {
      minLength: 1,
      maxLength: 100,
    },
    required: true,
  },
  age: {
    type: 'number',
    rules: {
      min: 0,
      max: 200,
    },
    required: true,
  },
  hobbies: {
    type: 'array',
    items: {
      type: 'string',
      rules: {
        minLength: 1,
        maxLength: 100,
      },
    },
    required: true,
  },
}
