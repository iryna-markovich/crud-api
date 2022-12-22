import { ServerResponse } from 'http'
import { IncomingRequest } from '../app.types'

export default (req: IncomingRequest, res: ServerResponse): void => {
  let body = ''

  req.on('data', (chunk: Buffer) => {
    body += chunk
  })

  req.on('end', () => {
    if (body) req.body = JSON.parse(body)
  })
}
