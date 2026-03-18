import type { Request, Response } from 'express'

export type ApiErrorShape = {
  message: string
  details?: unknown
}

export function ok(res: Response, data: unknown) {
  return res.json({ ok: true, data })
}

export function badRequest(res: Response, message: string, details?: unknown) {
  return res.status(400).json({ ok: false, error: { message, details } satisfies ApiErrorShape })
}

export function unauthorized(res: Response, message = 'Unauthorized') {
  return res.status(401).json({ ok: false, error: { message } satisfies ApiErrorShape })
}

export function notFound(res: Response, message = 'Not found') {
  return res.status(404).json({ ok: false, error: { message } satisfies ApiErrorShape })
}

export function internal(res: Response, message = 'Internal server error', details?: unknown) {
  return res.status(500).json({ ok: false, error: { message, details } satisfies ApiErrorShape })
}

export function getRequestId(req: Request) {
  return req.header('x-request-id') ?? undefined
}

