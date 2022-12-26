import { Request, Response } from '../app.types'

export default (req: Request, res: Response): void => {
  const url = req.url?.split('/').slice(1)
  const apiPrefix = url?.[0]
  const endpoint = url?.[1]
  const id = url?.[2]

  if (id) {
    req.id = id
    req.url = `/${apiPrefix}/${endpoint}/:id`
  }
}
