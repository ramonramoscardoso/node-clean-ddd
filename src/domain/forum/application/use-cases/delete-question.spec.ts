import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to delete a question by id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('456') },
      new UniqueEntityID('123'),
    )
    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
    )
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    expect(inMemoryQuestionsRepository.items).toHaveLength(1)

    await sut.execute({ questionId: '123', authorId: '456' })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
  })

  test('it should not be able to delete a question of another user', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('456') },
      new UniqueEntityID('123'),
    )
    inMemoryQuestionsRepository.create(newQuestion)

    expect(inMemoryQuestionsRepository.items).toHaveLength(1)

    const result = await sut.execute({ questionId: '123', authorId: '789' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
