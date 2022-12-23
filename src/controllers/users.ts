import { Request, Response } from './../app.types'
import User, { UserRecord } from '../models/User'
import { ERRORS } from '../utils/getError'
import validate from '../utils/validate'
import { IncomingMessage, Server } from 'http'

const users = new User()

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const data = await users.findAll()

  res.send?.({ status: 200, data })
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.id
  const { isValid, message } = validate({ id })

  if (!isValid) {
    res.send({ status: 400, error: { name: ERRORS.BAD_REQUEST, message } })
  }

  const data = await users.findByPk(id)

  if (!data) {
    const message = `record id '${id}' is not found`
    res.send({ status: 404, error: { name: ERRORS.NOT_FOUND, message } })
  }

  res.send({ status: 200, data })
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body
  const { isValid, message } = validate(body)

  if (!isValid) {
    res.send({ status: 400, error: { name: ERRORS.BAD_REQUEST, message } })
  }

  const data = await users.create(body as UserRecord)

  res.send({ status: 201, data })
}

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.id
  const body = req.body
  const { isValid, message } = validate({ id, ...body })

  if (!isValid) {
    res.send({ status: 400, error: { name: ERRORS.BAD_REQUEST, message } })
  }

  const data = await users.update(id, body as UserRecord)

  if (!data) {
    const message = `record id '${id}' is not found`
    res.send({ status: 404, error: { name: ERRORS.NOT_FOUND, message } })
  }

  res.send({ status: 200, data })
}

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.id
  const { isValid, message } = validate({ id })

  if (!isValid) {
    res.send({ status: 400, error: { name: ERRORS.BAD_REQUEST, message } })
  }

  const data = await users.destroy(id)

  if (!data) {
    const message = `record id '${id}' is not found`
    res.send({ status: 404, error: { name: ERRORS.NOT_FOUND, message } })
  }

  res.send({ status: 204, data })
}
