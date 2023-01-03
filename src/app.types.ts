import { IncomingMessage, ServerResponse } from 'http'

export type ErrorType = {
  name: string
  message: string
}

export type Payload = {
  status: number
  data?: unknown
  error?: Error
}

export type Request = IncomingMessage & {
  id?: string
  body?: object
}

export type Response = ServerResponse & {
  send?: (payload: Payload) => void
}

export type Middleware = (req: Request, res: Response) => void
