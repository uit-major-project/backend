import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function databaseSeeder() {
  await prisma.user.create({
    data: {
      id: '213984365655',
      firstname: 'test1',
      lastname: 'email1',
      email: 'testemail22@gmail.com',
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
