import 'dotenv/config'
import Application from './app'
import jsonParser from './middlewares/jsonParser'
import bodyParser from './middlewares/bodyParser'

import { Middleware } from './app.types'

const port = Number(process.env.PORT) || 3000
const app = new Application()

app.use(jsonParser as Middleware)
app.use(bodyParser as Middleware)

const runServer = (): void => {
  const server = app.listen(port)

  server.on('listening', () => {
    console.log('💚 Server started and listening on port %s', port)
  })
}

runServer()
