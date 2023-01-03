import { Request, Response, Payload } from '../app.types'

export default (req: Request, res: Response): void => {
  res.send = (payload: Payload): void => {
    res.writeHead(payload.status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(payload.data || payload.error))
  }
}
