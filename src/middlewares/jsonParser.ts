import { Request, Response } from '../app.types'

export default (req: Request, res: Response): void => {
  res.send = (data: unknown): void => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  }
}
