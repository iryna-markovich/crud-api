import { createServer, Server } from 'http'
import EventEmitter from 'events'
import { Middleware, Request, Response } from './app.types'
import { ERRORS } from './constants/errors'
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from './controllers/users'

const emitter = new EventEmitter()

emitter.on('/users:GET', getUsers)
emitter.on('/users/:id:GET', getUser)
emitter.on('/users:POST', createUser)
emitter.on('/users/:id:PUT', updateUser)
emitter.on('/users/:id:DELETE', deleteUser)

export default class Application {
  private middlewares: Middleware[] = []

  use(middleware: Middleware): void {
    this.middlewares.push(middleware)
  }

  listen(port: number): Server {
    const server = createServer((req: Request, res: Response) => {
      this.middlewares.forEach((middleware) => middleware(req, res))

      req.on('end', () => {
        const url = req.url
        const emitted = emitter.emit(`${url}:${req.method}`, req, res)

        if (!emitted) {
          res.send?.({
            status: 404,
            error: {
              name: ERRORS.NOT_FOUND,
              message: `resource '${url}' is not found`,
            },
          })
        }
      })
    })

    return server.listen(port)
  }
}
