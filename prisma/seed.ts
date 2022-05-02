import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function databaseSeeder() {
  await prisma.user.create({
    data: {
      id: '213984365654',
      firstname: 'test',
      lastname: 'email',
      email: 'testemail2@gmail.com',
      // role: 'ADMIN',
      image: '',
      pincode: '',
    },
  });
}

databaseSeeder()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // get a user from database
    const adminUser = await prisma.user.findFirst();
    console.log('user', adminUser);
    await prisma.$disconnect();
  });
