import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { env } from '../lib/env.js'
import { badRequest, ok, unauthorized } from '../lib/http.js'

const LoginSchema = z.object({
  password: z.string().min(1),
})

export async function adminLogin(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) return badRequest(res, 'Invalid payload', parsed.error.flatten())

  if (parsed.data.password !== env.adminPassword) return unauthorized(res, 'Wrong password')

  const token = jwt.sign({ sub: 'admin' }, env.jwtSecret, { expiresIn: '7d' })
  return ok(res, { token })
}

