import 'dotenv/config'
import request from 'supertest'
import { UserRecord } from '../../models/User'

import { mockUserData, mockLongString } from './__mocks__'

const port = Number(process.env.PORT) || 3000
const url = `http://localhost:${port}`

describe('users POST', () => {
  let user: UserRecord

  const userData = mockUserData

  afterAll(async () => {
    if (user.id) await request(url).delete(`/api/users/${user.id}`)
  })

  it('should create user', async () => {
    const response = await request(url).post('/api/users').send(userData)
    user = response.body

    expect(response.status).toEqual(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.username).toEqual(userData.username)
    expect(response.body.age).toEqual(userData.age)
    expect(response.body.hobbies).toEqual(userData.hobbies)
  })

  it.each`
    username          | age          | hobbies        | message
    ${undefined}      | ${23}        | ${[]}          | ${'"username" value is required'}
    ${null}           | ${23}        | ${[]}          | ${'"username" value must be a type of string'}
    ${{}}             | ${23}        | ${[]}          | ${'"username" value must be a type of string'}
    ${[]}             | ${23}        | ${[]}          | ${'"username" value must be a type of string'}
    ${23}             | ${23}        | ${[]}          | ${'"username" value must be a type of string'}
    ${''}             | ${23}        | ${[]}          | ${'"username" value must be longer then 1 chars'}
    ${mockLongString} | ${23}        | ${[]}          | ${'"username" value must be less then 100 chars'}
    ${'name'}         | ${undefined} | ${[]}          | ${'"age" value is required'}
    ${'name'}         | ${null}      | ${[]}          | ${'"age" value must be a type of number'}
    ${'name'}         | ${{}}        | ${[]}          | ${'"age" value must be a type of number'}
    ${'name'}         | ${[]}        | ${[]}          | ${'"age" value must be a type of number'}
    ${'name'}         | ${'str'}     | ${[]}          | ${'"age" value must be a type of number'}
    ${'name'}         | ${-23}       | ${[]}          | ${'"age" value must be more then 0'}
    ${'name'}         | ${323}       | ${[]}          | ${'"age" value must be less then 200'}
    ${'name'}         | ${23}        | ${undefined}   | ${'"hobbies" value is required'}
    ${'name'}         | ${23}        | ${null}        | ${'"hobbies" value must be a type of array'}
    ${'name'}         | ${23}        | ${[1]}         | ${'items of "hobbies" value must be a type of string'}
    ${'name'}         | ${23}        | ${['']}        | ${'items of "hobbies" value must be longer then 1 chars'}
    ${'name'}         | ${23}        | ${[undefined]} | ${'items of "hobbies" value must be a type of string'}
    ${'name'}         | ${23}        | ${[null]}      | ${'items of "hobbies" value must be a type of string'}
    ${'name'}         | ${23}        | ${[{}]}        | ${'items of "hobbies" value must be a type of string'}
    ${'name'}         | ${23}        | ${[[]]}        | ${'items of "hobbies" value must be a type of string'}
    ${''}             | ${''}        | ${''}          | ${'"username" value must be longer then 1 chars, "age" value must be a type of number, "hobbies" value must be a type of array'}
  `(
    'should return an error if user data is invalid',
    async ({ username, age, hobbies, message }) => {
      const response = await request(url)
        .post('/api/users')
        .send({ username, age, hobbies })

      expect(response.status).toEqual(400)
      expect(response.body).toEqual({ message, name: 'Bad Request' })
    }
  )
})
