import cors from 'cors'
import express from 'express'

import { env } from './lib/env.js'
import { internal, ok } from './lib/http.js'
import { prisma } from './lib/prisma.js'
import { adminRouter } from './routes/admin.js'
import { publicRouter } from './routes/public.js'

const app = express()

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true)
      if (env.corsOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => ok(res, { up: true }))

app.use(publicRouter)
app.use('/admin', adminRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  return internal(res)
})

const server = app.listen(env.port, () => {
  console.log(`get-in4 backend listening on http://localhost:${env.port}`)
})

async function shutdown(signal: string) {
  console.log(`\nShutting down (${signal})...`)
  server.close(() => void 0)
  await prisma.$disconnect().catch(() => void 0)
  process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))

