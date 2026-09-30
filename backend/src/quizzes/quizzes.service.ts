import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  private validateCheckboxQuestions(questions: CreateQuestionDto[]): void {
    for (const question of questions) {
      if (question.type === 'CHECKBOX') {
        const hasCorrectOption = question.options?.some(
          (option) => option.isCorrect === true,
        );
        if (!hasCorrectOption) {
          throw new BadRequestException(
            `Checkbox question "${question.text}" must have at least one correct option`,
          );
        }
      }
    }
  }

  async create(createQuizDto: CreateQuizDto) {
    this.validateCheckboxQuestions(createQuizDto.questions);

    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        questions: {
          create: createQuizDto.questions.map((question, index) => ({
            type: question.type,
            text: question.text,
            order: index,
            correctBool:
              question.type === 'BOOLEAN' ? question.correctBool : undefined,
            correctText:
              question.type === 'INPUT' ? question.correctText : undefined,
            options:
              question.type === 'CHECKBOX' && question.options
                ? {
                    create: question.options.map((option) => ({
                      text: option.text,
                      isCorrect: option.isCorrect,
                    })),
                  }
                : undefined,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionsCount: quiz._count.questions,
    }));
  }

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async remove(id: number): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    await this.prisma.quiz.delete({
      where: { id },
    });
  }
}
