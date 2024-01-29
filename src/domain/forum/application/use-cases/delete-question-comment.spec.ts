import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteCommentOnQuestionUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteCommentOnQuestionUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteCommentOnQuestionUseCase(inMemoryQuestionCommentsRepository)
  })

  it('it should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment({})
    inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('it should not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionComment({})
    inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString() + 'justatexttothrowerror',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
