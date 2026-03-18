import type { Prisma } from '@prisma/client'
import type { Request, Response } from 'express'
import { z } from 'zod'

import { badRequest, notFound, ok } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'

const QuestionType = z.enum(['text', 'single', 'multiple'])

const QuestionOptionsSchema = z
  .unknown()
  .optional()
  .refine(
    (v) => {
      if (v === undefined || v === null) return true
      return typeof v === 'object'
    },
    { message: 'options must be an object/array' },
  )

const CreateQuestionSchema = z.object({
  content: z.string().min(1).max(500),
  type: QuestionType,
  options: QuestionOptionsSchema,
})

const UpdateQuestionSchema = CreateQuestionSchema.partial().refine((v) => Object.keys(v).length > 0, {
  message: 'Empty payload',
})

function normalizeOptions(type: z.infer<typeof QuestionType>, raw: unknown) {
  if (type === 'text') {
    if (!raw) return undefined
    const schema = z.object({ variant: z.enum(['input', 'textarea']).optional() }).passthrough()
    return schema.parse(raw)
  }

  const schema = z.object({ choices: z.array(z.string().min(1).max(120)).min(1).max(20) })
  return schema.parse(raw ?? {})
}

export async function getPublicQuestions(_req: Request, res: Response) {
  const items = await prisma.question.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, content: true, type: true, options: true, createdAt: true },
  })
  return ok(res, items)
}

export async function adminListQuestions(_req: Request, res: Response) {
  const items = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return ok(res, items)
}

export async function adminCreateQuestion(req: Request, res: Response) {
  const parsed = CreateQuestionSchema.safeParse(req.body)
  if (!parsed.success) return badRequest(res, 'Invalid payload', parsed.error.flatten())

  let options: unknown | undefined
  try {
    options = normalizeOptions(parsed.data.type, parsed.data.options)
  } catch (e) {
    return badRequest(res, 'Invalid options', e)
  }

  const created = await prisma.question.create({
    data: {
      content: parsed.data.content,
      type: parsed.data.type,
      options: options as Prisma.InputJsonValue | undefined,
    },
  })
  return ok(res, created)
}

export async function adminUpdateQuestion(req: Request, res: Response) {
  const id = String(req.params.id ?? '')
  if (!id) return badRequest(res, 'Missing id')

  const parsed = UpdateQuestionSchema.safeParse(req.body)
  if (!parsed.success) return badRequest(res, 'Invalid payload', parsed.error.flatten())

  const existing = await prisma.question.findUnique({ where: { id } })
  if (!existing) return notFound(res, 'Question not found')

  const nextType = parsed.data.type ?? (existing.type as z.infer<typeof QuestionType>)

  let options: unknown | undefined = existing.options ?? undefined
  if ('options' in parsed.data || 'type' in parsed.data) {
    try {
      options = normalizeOptions(nextType, parsed.data.options ?? options)
    } catch (e) {
      return badRequest(res, 'Invalid options', e)
    }
  }

  const updated = await prisma.question.update({
    where: { id },
    data: {
      content: parsed.data.content ?? existing.content,
      type: nextType,
      options: options as Prisma.InputJsonValue | undefined,
    },
  })
  return ok(res, updated)
}

export async function adminDeleteQuestion(req: Request, res: Response) {
  const id = String(req.params.id ?? '')
  if (!id) return badRequest(res, 'Missing id')

  const existing = await prisma.question.findUnique({ where: { id } })
  if (!existing) return notFound(res, 'Question not found')

  await prisma.question.delete({ where: { id } })
  return ok(res, { deleted: true })
}

