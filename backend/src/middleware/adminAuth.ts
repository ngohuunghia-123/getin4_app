import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { env } from '../lib/env.js'
import { unauthorized } from '../lib/http.js'

export type AdminJwtPayload = {
  sub: 'admin'
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization')
  if (!header) return unauthorized(res)
  const [kind, token] = header.split(' ')
  if (kind !== 'Bearer' || !token) return unauthorized(res)

  try {
    jwt.verify(token, env.jwtSecret) as AdminJwtPayload
    next()
  } catch {
    return unauthorized(res)
  }
}

