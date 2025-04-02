import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test user with hashed password
  const testUser = await prisma.user.upsert({
    where: { email: process.env.TEST_USER },
    update: {},
    create: {
      email: process.env.TEST_USER,
      password: await bcrypt.hash(process.env.TEST_PASSWORD!, 12),
      role: 'ADMIN'
    }
  })

  console.log(`Seeded test user: ${testUser.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 