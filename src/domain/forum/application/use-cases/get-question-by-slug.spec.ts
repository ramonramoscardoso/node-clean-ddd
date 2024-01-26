import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({ title: 'Just a test' })
    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({ slug: 'just-a-test' })

    expect(result.isRight()).toBe(true)
  })
})
