import { createServer, ServerResponse, Server } from 'http'
import EventEmitter from 'events'
import User from './models/users/User'
import { Middleware, IncomingRequest } from './app.types'

const emitter = new EventEmitter()
const users = new User()

emitter.on('/users:GET', async (req, res) => {
  const data = await users.findAll()

  res.send(data)
})

emitter.on('/users:POST', async (req, res) => {
  const data = await users.create(req.body)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
})

emitter.on('/users/:id:PUT', async (req, res) => {
  const data = await users.update(req.id, req.body)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
})

emitter.on('/users/:id:DELETE', async (req, res) => {
  const data = await users.destroy(req.id)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
})

export default class Application {
  private middlewares: Middleware[] = []

  use(middleware: Middleware): void {
    this.middlewares.push(middleware)
  }

  listen(port: number): Server {
    const server = createServer((req: IncomingRequest, res: ServerResponse) => {
      this.middlewares.forEach((middleware) => middleware(req, res))

      req.on('end', () => {
        const emitted = emitter.emit(`${req.url}:${req.method}`, req, res)

        if (!emitted) res.end()
      })
    })

    return server.listen(port)
  }
}
