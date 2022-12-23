import { Request, Response } from './../app.types'
import User, { UserRecord } from '../models/User'
import { ERRORS } from '../constants/errors'
import { validationSchema } from './users.schema'
import { validateId, validateBody } from '../utils/validate'

const users = new User()

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  let data

  try {
    data = await users.findAll()
  } catch (e) {
    return res.send?.({
      status: 500,
      error: {
        name: ERRORS.SERVER_ERROR,
        message: (e as Error).message || 'general server error',
      },
    })
  }

  res.send?.({ status: 200, data })
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  let data

  const id = req.id
  const { valid, message } = validateId(id)

  if (!valid) {
    return res.send?.({
      status: 400,
      error: { name: ERRORS.BAD_REQUEST, message },
    })
  }

  try {
    data = await users.findByPk(id as string)
  } catch (e) {
    return res.send?.({
      status: 500,
      error: {
        name: ERRORS.SERVER_ERROR,
        message: (e as Error).message || 'general server error',
      },
    })
  }

  if (!data) {
    const message = `record id '${id}' is not found`

    return res.send?.({
      status: 404,
      error: { name: ERRORS.NOT_FOUND, message },
    })
  }

  res.send?.({ status: 200, data })
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  let data

  const body = req.body
  const { valid, message } = validateBody(body as UserRecord, validationSchema)

  if (!valid) {
    return res.send?.({
      status: 400,
      error: { name: ERRORS.BAD_REQUEST, message },
    })
  }

  try {
    data = await users.create(body as UserRecord)
  } catch (e) {
    return res.send?.({
      status: 500,
      error: {
        name: ERRORS.SERVER_ERROR,
        message: (e as Error).message || 'general server error',
      },
    })
  }

  res.send?.({ status: 201, data })
}

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  let data

  const id = req.id
  const body = req.body
  const { valid: validId, message: idMessage } = validateId(id)

  if (!validId) {
    return res.send?.({
      status: 400,
      error: { name: ERRORS.BAD_REQUEST, message: idMessage },
    })
  }

  const { valid: validBody, message: bodyMessage } = validateBody(
    body as UserRecord,
    validationSchema
  )

  if (!validBody) {
    return res.send?.({
      status: 400,
      error: { name: ERRORS.BAD_REQUEST, message: bodyMessage },
    })
  }

  try {
    data = await users.update(id as string, body as UserRecord)
  } catch (e) {
    return res.send?.({
      status: 500,
      error: {
        name: ERRORS.SERVER_ERROR,
        message: (e as Error).message || 'general server error',
      },
    })
  }

  if (!data) {
    const message = `record id '${id}' is not found`

    return res.send?.({
      status: 404,
      error: { name: ERRORS.NOT_FOUND, message },
    })
  }

  res.send?.({ status: 200, data })
}

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  let data

  const id = req.id
  const { valid, message } = validateId(id)

  if (!valid) {
    return res.send?.({
      status: 400,
      error: { name: ERRORS.BAD_REQUEST, message },
    })
  }

  try {
    data = await users.destroy(id as string)
  } catch (e) {
    return res.send?.({
      status: 500,
      error: {
        name: ERRORS.SERVER_ERROR,
        message: (e as Error).message || 'general server error',
      },
    })
  }

  if (!data) {
    const message = `record id '${id}' is not found`

    return res.send?.({
      status: 404,
      error: { name: ERRORS.NOT_FOUND, message },
    })
  }

  res.send?.({ status: 204, data })
}
