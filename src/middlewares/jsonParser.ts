import { IncomingMessage, ServerResponse } from 'http'
import { SendCallback } from '../app.types'

export default (
  req: IncomingMessage,
  res: ServerResponse & SendCallback
): void => {
  res.send = (data: unknown): void => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  }
}
