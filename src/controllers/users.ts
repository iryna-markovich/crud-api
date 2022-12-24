import { Request, Response } from './../app.types'
import { UserRecord } from '../models/User'
import { users } from '../models'
import { ERRORS } from '../constants/errors'
import { validationSchema } from './users.schema'
import { validateId, validateBody } from '../utils/validate'

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  let data
  let payload
  let message

  try {
    data = await users.findAll()
    payload = { status: 200, data }
  } catch (e) {
    message = (e as Error).message || 'general server error'
    payload = { status: 500, error: { name: ERRORS.SERVER_ERROR, message } }
  }

  res.send?.(payload)
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  let data
  let payload
  let message

  const id = req.id
  const { valid, errors } = validateId(id)

  if (!valid) {
    message = errors as string
    payload = { status: 400, error: { name: ERRORS.BAD_REQUEST, message } }
  } else {
    try {
      data = await users.findByPk(id as string)
      payload = { status: 200, data }
    } catch (e) {
      message = (e as Error).message || 'general server error'
      payload = { status: 500, error: { name: ERRORS.SERVER_ERROR, message } }
    }

    if (!data) {
      message = `record id '${id}' is not found`
      payload = { status: 404, error: { name: ERRORS.NOT_FOUND, message } }
    }
  }

  res.send?.(payload)
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  let data
  let payload
  let message

  const body = req.body
  const { valid, errors } = validateBody(body as UserRecord, validationSchema)

  if (!valid) {
    message = errors as string
    payload = { status: 400, error: { name: ERRORS.BAD_REQUEST, message } }
  } else {
    try {
      data = await users.create(body as UserRecord)
      payload = { status: 200, data }
    } catch (e) {
      message = (e as Error).message || 'general server error'
      payload = { status: 500, error: { name: ERRORS.SERVER_ERROR, message } }
    }
  }

  res.send?.(payload)
}

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  let data
  let payload
  let message

  const id = req.id
  const body = req.body
  const { valid: validId, errors: idErrors } = validateId(id)
  const { valid: validBody, errors: bodyErrors } = validateBody(
    body as UserRecord,
    validationSchema
  )

  if (!validId || !validBody) {
    message = (idErrors || bodyErrors) as string
    payload = { status: 400, error: { name: ERRORS.BAD_REQUEST, message } }
  } else {
    try {
      data = await users.update(id as string, body as UserRecord)
      payload = { status: 200, data }
    } catch (e) {
      message = (e as Error).message || 'general server error'
      payload = { status: 500, error: { name: ERRORS.SERVER_ERROR, message } }
    }

    if (!data) {
      message = `record id '${id}' is not found`
      payload = { status: 404, error: { name: ERRORS.NOT_FOUND, message } }
    }
  }

  res.send?.(payload)
}

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  let data
  let payload
  let message

  const id = req.id
  const { valid, errors } = validateId(id)

  if (!valid) {
    message = errors as string
    payload = { status: 400, error: { name: ERRORS.BAD_REQUEST, message } }
  } else {
    try {
      data = await users.destroy(id as string)
      payload = { status: 204, data }
    } catch (e) {
      message = (e as Error).message || 'general server error'
      payload = {
        status: 500,
        error: { name: ERRORS.SERVER_ERROR, message },
      }
    }
    if (!data) {
      message = `record id '${id}' is not found`
      payload = { status: 404, error: { name: ERRORS.NOT_FOUND, message } }
    }
  }

  res.send?.(payload)
}
