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

const apiPrefix = '/api'
const emitter = new EventEmitter()

emitter.on(`GET:${apiPrefix}/users`, getUsers)
emitter.on(`GET:${apiPrefix}/users/:id`, getUser)
emitter.on(`POST:${apiPrefix}/users`, createUser)
emitter.on(`PUT:${apiPrefix}/users/:id`, updateUser)
emitter.on(`DELETE:${apiPrefix}/users/:id`, deleteUser)

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
        const emitted = emitter.emit(`${req.method}:${url}`, req, res)

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
