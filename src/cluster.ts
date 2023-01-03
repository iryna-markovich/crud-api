import * as os from 'os'
import cluster from 'cluster'

const runCluster = (): void => {
  if (cluster.isPrimary) {
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker with pid '${worker.process.pid}' has exited`)

      cluster.fork()
    })
  } else {
    console.log(`Worker ${process.pid} is running`)
    import('./index')
  }
}

runCluster()
