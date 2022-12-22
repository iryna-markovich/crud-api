import { IncomingMessage, ServerResponse } from 'http'

export type IncomingRequest = IncomingMessage & { body?: object }

export type ServerResp = ServerResponse & {
  send: (data: unknown) => void
}

export type RequestListener = (
  req: IncomingMessage,
  res: ServerResponse
) => void

export type SendCallback = {
  send: (data: unknown) => void
}

export type Middleware = RequestListener & {
  send: SendCallback
}