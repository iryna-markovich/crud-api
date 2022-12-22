import { Request, Response } from '../app.types'

export default (req: Request, res: Response): void => {
  let body = ''

  req.on('data', (chunk: Buffer) => {
    body += chunk
  })

  req.on('end', () => {
    if (body) req.body = JSON.parse(body)
  })
}
