import { createServer, Server } from 'http'
import EventEmitter from 'events'
import User from './models/users/User'
import { Middleware, Request, Response } from './app.types'

const emitter = new EventEmitter()
const users = new User()

emitter.on('/users:GET', async (req, res) => {
  const data = await users.findAll()

  res.send(data)
})

emitter.on('/users/:id:GET', async (req, res) => {
  console.log(req.id, '-----')
  const data = await users.findByPk(req.id)

  res.send(data)
})

emitter.on('/users:POST', async (req, res) => {
  const data = await users.create(req.body)

  res.send(data)
})

emitter.on('/users/:id:PUT', async (req, res) => {
  const data = await users.update(req.id, req.body)

  res.send(data)
})

emitter.on('/users/:id:DELETE', async (req, res) => {
  const data = await users.destroy(req.id)

  res.send(data)
})

export default class Application {
  private middlewares: Middleware[] = []

  use(middleware: Middleware): void {
    this.middlewares.push(middleware)
  }

  listen(port: number): Server {
    const server = createServer((req: Request, res: Response) => {
      this.middlewares.forEach((middleware) => middleware(req, res))

      req.on('end', () => {
        console.log(req.url)
        const emitted = emitter.emit(`${req.url}:${req.method}`, req, res)

        if (!emitted) res.end()
      })
    })

    return server.listen(port)
  }
}
