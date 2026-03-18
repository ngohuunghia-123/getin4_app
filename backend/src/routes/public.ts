import { Router } from 'express'

import { submitAnswers } from '../controllers/answerController.js'
import { getPublicQuestions } from '../controllers/questionController.js'

export const publicRouter = Router()

publicRouter.get('/questions', getPublicQuestions)
publicRouter.post('/answers', submitAnswers)

