export type QuestionType = 'text' | 'single' | 'multiple'

export type QuestionOptions =
  | {
      variant?: 'input' | 'textarea'
    }
  | {
      choices: string[]
    }

