import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteCommentOnAnswerUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteCommentOnAnswerUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteCommentOnAnswerUseCase(inMemoryAnswerCommentsRepository)
  })

  it('it should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment({})
    inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('it should not be able to delete a answer comment from another user', async () => {
    const answerComment = makeAnswerComment({})
    inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(() => {
      return sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: answerComment.authorId.toString() + 'justatexttothrowerror',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
