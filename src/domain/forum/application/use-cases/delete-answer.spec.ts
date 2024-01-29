import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  test('it should be able to delete an answer by id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('456') },
      new UniqueEntityID('123'),
    )
    inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
    )
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    await sut.execute({ answerId: '123', authorId: '456' })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })

  test('it should not be able to delete a answer of another user', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('456') },
      new UniqueEntityID('123'),
    )
    inMemoryAnswersRepository.create(newAnswer)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    const result = await sut.execute({ answerId: '123', authorId: '789' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
