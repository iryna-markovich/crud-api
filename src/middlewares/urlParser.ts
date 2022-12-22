import { Request, Response } from '../app.types'

export default (req: Request, res: Response): void => {
  const id = req.url?.split('/')[2]
  const endpoint = req.url?.split('/')[1]

  if (id) {
    req.id = id
    req.url = `/${endpoint}/:id`
  }
}
