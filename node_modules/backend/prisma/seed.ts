import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.question.count()
  if (count > 0) return

  await prisma.question.createMany({
    data: [
      {
        content: 'Tên bạn là gì?',
        type: 'text',
        options: { variant: 'input' },
      },
      {
        content: 'Một điều bạn muốn mình biết về bạn?',
        type: 'text',
        options: { variant: 'textarea' },
      },
      {
        content: 'Nếu mình là một màu, bạn nghĩ đó là màu gì?',
        type: 'single',
        options: { choices: ['Hồng pastel', 'Tím lavender', 'Trắng sữa', 'Vàng kem'] },
      },
      {
        content: 'Bạn thích vibe nào cho buổi hẹn đầu?',
        type: 'multiple',
        options: { choices: ['Cafe nhẹ', 'Dạo phố tối', 'Xem phim', 'Đi ăn vặt', 'Picnic'] },
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

