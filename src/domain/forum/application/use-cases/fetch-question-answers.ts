import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

interface FetchQuestionAnswersUseCaseResponse {
  questionComment: QuestionComment[]
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: QuestionsCommentsRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const questionComment = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return { questionComment }
  }
}
