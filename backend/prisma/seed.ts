import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  await prisma.quiz.create({
    data: {
      title: 'General Knowledge Quiz',
      questions: {
        create: [
          {
            type: 'BOOLEAN',
            text: 'Is TypeScript a superset of JavaScript?',
            order: 0,
            correctBool: true,
          },
          {
            type: 'INPUT',
            text: 'What is the capital of France?',
            order: 1,
            correctText: 'Paris',
          },
          {
            type: 'CHECKBOX',
            text: 'Which of the following are primary colors of light?',
            order: 2,
            options: {
              create: [
                { text: 'Red', isCorrect: true },
                { text: 'Green', isCorrect: true },
                { text: 'Blue', isCorrect: true },
                { text: 'Yellow', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
