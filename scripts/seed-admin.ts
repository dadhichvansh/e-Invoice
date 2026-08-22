import { hashPassword } from '@/lib/authentication/password';
import { prisma } from '@/lib/db/prisma';
import 'dotenv/config';

async function main() {
  const name = 'Your Name';
  const email = 'your-email@example.com';
  const password = 'password';

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  });

  console.log(`User created successfully: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
