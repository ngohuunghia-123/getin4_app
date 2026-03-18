import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  timeout: 15000,
})

export type QuestionType = 'text' | 'single' | 'multiple'

export type QuestionOptions =
  | {
      variant?: 'input' | 'textarea'
    }
  | {
      choices: string[]
    }

export type Question = {
  id: string
  content: string
  type: QuestionType
  options?: QuestionOptions | null
  createdAt: string
}

export type AnswerRow = {
  id: string
  questionId: string
  answer: unknown
  createdAt: string
  question: Question
}

export function setAdminToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}

