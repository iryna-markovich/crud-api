import 'dotenv/config'
import request from 'supertest'
import { UserRecord } from '../../models/User'

import { mockUserData, mockNewUserData, mockLongString } from './__mocks__'

const port = Number(process.env.PORT) || 3000
const url = `http://localhost:${port}`

describe('users PUT', () => {
  let user: UserRecord

  const validId = '22078811-3bad-4bbb-8169-9af7af7ddc1d'
  const invalidId = 'mock-uuid-id'
  const userData = mockUserData
  const userNewData = mockNewUserData

  beforeAll(async () => {
    const response = await request(url).post('/api/users').send(userData)
    user = response.body
  })

  afterAll(async () => {
    if (user.id) await request(url).delete(`/api/users/${user.id}`)
  })

  it('should update user', async () => {
    const response = await request(url)
      .put(`/api/users/${user.id}`)
      .send(userNewData)

    expect(response.status).toEqual(200)
    expect(response.body.id).toEqual(user.id)
    expect(response.body.username).toEqual(userNewData.username)
    expect(response.body.age).toEqual(userNewData.age)
    expect(response.body.hobbies).toEqual(userNewData.hobbies)
  })

  it('should return an error if id is invalid', async () => {
    const response = await request(url)
      .put(`/api/users/${invalidId}`)
      .send(userNewData)

    expect(response.status).toEqual(400)
    expect(response.body).toEqual({
      message: '"id" value should be a valid uuid',
      name: 'Bad Request',
    })
  })

  it('should return an error if user with provided id does not exist', async () => {
    const response = await request(url)
      .put(`/api/users/${validId}`)
      .send(userNewData)

    expect(response.status).toEqual(404)
    expect(response.body).toEqual({
      message: `record id '${validId}' is not found`,
      name: 'Not Found',
    })
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
        .put(`/api/users/${user.id}`)
        .send({ username, age, hobbies })

      expect(response.status).toEqual(400)
      expect(response.body).toEqual({ message, name: 'Bad Request' })
    }
  )
})
