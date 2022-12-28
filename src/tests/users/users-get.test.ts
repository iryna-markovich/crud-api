import 'dotenv/config'
import request from 'supertest'
import { UserRecord } from '../../models/User'

import { mockUserData } from './__mocks__'

const port = Number(process.env.PORT) || 3000
const url = `http://localhost:${port}`

describe('users GET', () => {
  describe('all', () => {
    it('should return empty list of the users', async () => {
      const response = await request(url).get('/api/users')

      expect(response.status).toEqual(200)
      expect(response.body).toEqual([])
    })
  })

  describe('one', () => {
    let user: UserRecord

    const validId = '22078811-3bad-4bbb-8169-9af7af7ddc1d'
    const invalidId = 'mock-uuid-id'
    const userData = { ...mockUserData }

    beforeAll(async () => {
      const response = await request(url).post('/api/users').send(userData)
      user = response.body
    })

    afterAll(async () => {
      if (user?.id) await request(url).delete(`/api/users/${user.id}`)
    })

    it('should return one user', async () => {
      const response = await request(url).get(`/api/users/${user.id}`)

      expect(response.status).toEqual(200)
      expect(response.body.id).toEqual(user.id)
      expect(response.body.username).toEqual(userData.username)
      expect(response.body.age).toEqual(userData.age)
      expect(response.body.hobbies).toEqual(userData.hobbies)
    })

    it('should return an error if id is invalid', async () => {
      const response = await request(url).get(`/api/users/${invalidId}`)

      expect(response.status).toEqual(400)
      expect(response.body).toEqual({
        message: '"id" value should be a valid uuid',
        name: 'Bad Request',
      })
    })

    it('should return an error if user with provided id does not exist', async () => {
      const response = await request(url).get(`/api/users/${validId}`)

      expect(response.status).toEqual(404)
      expect(response.body).toEqual({
        message: `record id '${validId}' is not found`,
        name: 'Not Found',
      })
    })
  })
})
