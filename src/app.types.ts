import { IncomingMessage, ServerResponse } from 'http'

export type Request = IncomingMessage & {
  id?: string
  body?: object
}

export type Response = ServerResponse & {
  send?: (data: unknown) => void
}

export type Middleware = (req: Request, res: Response) => void
