import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  test('it should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion({})
    const answer = makeAnswer(
      {
        questionId: newQuestion.id,
      },
      new UniqueEntityID('answer-1'),
    )

    inMemoryAnswersRepository.create(answer)
    inMemoryQuestionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
    })

    expect(question.bestAnswerId?.toString()).toEqual('answer-1')
  })

  test('it should not be able to choose question best answer from another user', async () => {
    const newQuestion = makeQuestion({})
    const answer = makeAnswer(
      {
        questionId: newQuestion.id,
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    inMemoryAnswersRepository.create(answer)
    inMemoryQuestionsRepository.create(newQuestion)

    expect(() =>
      sut.execute({
        answerId: answer.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
