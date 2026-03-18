import type { Prisma } from '@prisma/client'
import type { Request, Response } from 'express'
import { z } from 'zod'

import { badRequest, ok } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'

const SubmitAnswerItemSchema = z.object({
  questionId: z.string().min(1),
  value: z.unknown(),
})

const SubmitAnswersSchema = z.object({
  answers: z.array(SubmitAnswerItemSchema).min(1).max(100),
})

export async function submitAnswers(req: Request, res: Response) {
  const parsed = SubmitAnswersSchema.safeParse(req.body)
  if (!parsed.success) return badRequest(res, 'Invalid payload', parsed.error.flatten())

  const ids = [...new Set(parsed.data.answers.map((a) => a.questionId))]
  const questions = await prisma.question.findMany({ where: { id: { in: ids } } })
  const byId = new Map(questions.map((q) => [q.id, q]))

  for (const a of parsed.data.answers) {
    const q = byId.get(a.questionId)
    if (!q) return badRequest(res, `Unknown questionId: ${a.questionId}`)

    if (q.type === 'text') {
      const schema = z.string().min(1).max(2000)
      const okText = schema.safeParse(a.value)
      if (!okText.success) return badRequest(res, `Invalid text answer for ${q.id}`, okText.error.flatten())
    } else if (q.type === 'single') {
      const parsedChoices = z.object({ choices: z.array(z.string()) }).safeParse(q.options ?? {})
      const choices = parsedChoices.success ? parsedChoices.data.choices : []

      const schema = z.string().min(1)
      const okSingle = schema.safeParse(a.value)
      if (!okSingle.success) return badRequest(res, `Invalid single answer for ${q.id}`)
      if (choices.length && !choices.includes(okSingle.data))
        return badRequest(res, `Answer not in choices for ${q.id}`)
    } else if (q.type === 'multiple') {
      const parsedChoices = z.object({ choices: z.array(z.string()) }).safeParse(q.options ?? {})
      const choices = parsedChoices.success ? parsedChoices.data.choices : []

      const schema = z.array(z.string().min(1)).min(1).max(choices.length || 20)
      const okMulti = schema.safeParse(a.value)
      if (!okMulti.success) return badRequest(res, `Invalid multiple answer for ${q.id}`)
      if (choices.length && okMulti.data.some((x) => !choices.includes(x)))
        return badRequest(res, `Answer contains invalid choice for ${q.id}`)
    }
  }

  await prisma.$transaction(
    parsed.data.answers.map((a) =>
      prisma.answer.create({
        data: {
          questionId: a.questionId,
          answer: a.value as Prisma.InputJsonValue,
        },
      }),
    ),
  )

  return ok(res, { saved: true })
}

export async function adminListAnswers(req: Request, res: Response) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const questionId = typeof req.query.questionId === 'string' ? req.query.questionId : undefined

  const items = await prisma.answer.findMany({
    where: {
      ...(questionId ? { questionId } : {}),
      ...(q
        ? {
            question: {
              content: { contains: q, mode: 'insensitive' },
            },
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 300,
    include: { question: true },
  })

  const filtered =
    q && items.length
      ? items.filter((a) => JSON.stringify(a.answer).toLowerCase().includes(q.toLowerCase()))
      : items

  return ok(res, filtered)
}

