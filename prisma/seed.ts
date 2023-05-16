import { PrismaClient } from '@prisma/client';

import taskers from './data/taskers.json';

const prisma = new PrismaClient();

enum TaskSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

enum TaskStatus {
  open = 'open',
  in_progress = 'in_progress',
  done = 'done',
  cancelled = 'cancelled',
}

enum TaskCategory {
  cleaning = 'cleaning',
  moving = 'moving',
  electrician = 'electrician',
  painter = 'painter',
  cook = 'cook',
  mechanic = 'mechanic',
  plumber = 'plumber',
  driver = 'driver',
  technician = 'technician',
  // mounting = 'mounting',
}

enum Stars {
  one = 'one',
  two = 'two',
  three = 'three',
  four = 'four',
  five = 'five',
}

// async function databaseSeeder() {
//   await prisma.user.create({
//     data: {
//       id: '21398436565571111',
//       firstname: 'test1',
//       lastname: 'email1',
//       email: 'testemail22211111@gmail.com',
//       // role: 'ADMIN',
//       image: '',
//       pincode: '',
//     },
//   });

//   await prisma.user.update({
//     where: { id: '21398436565571111' },
//     data: {
//       // id: '2139843656556',
//       tasks: {
//         create: {
//           id: '21398436565571',
//           // createdAt: '2020-01-01',
//           // updatedAt: '2020-01-05',

//           description: 'Cleaning',
//           dueDate: new Date().toISOString(),
//           location: 'Location1',
//           pincode: '123456',
//           // user: {
//           //   connect: {
//           //     id: '213984365655',
//           //   }
//           // },

//           taskerInContact: {
//             connect: {
//               id: '1111112',
//             },
//           },

//           taskerAssigned: {
//             connect: {
//               id: '1111112',
//             },
//           },
//           // taskerAssigned: [],

//           size: 'small',
//           status: 'open',
//           // type: 'cleaning',

//           category: 'cleaning',

//           // rating: '',

//           // userId: '1111111',
//         },
//       },
//     },
//   });
// }

// async function seedTaskers() {
//   await prisma.tasker.create({
//     data: {
//       id: '1111112',
//       // updatedAt: '2020-01-08',
//       // createdAt: '2020-01-02',

//       firstname: 'jane',
//       lastname: 'maxwell',
//       email: 'jane1@mail.com',
//       image: '',
//       pincode: '123456',
//       phone: '1234567891',
//       permanentAddress: 'Permanent Address2',

//       isVerified: false,
//       hasPaidOneTimeFee: true,
//       isActive: false,

//       pricePerHourInRs: 100,
//       experience: '',
//       category: TaskCategory.cook,

//       rating: '',
//       ratingCount: 0,

//       area: 'Karond',

//       // inContact: [],
//       // assigned: [],
//     },
//   });

//   await prisma.tasker.update({
//     where: { id: '1111112' },
//     data: {
//       isVerified: true,
//     },
//   });
// }

// seedTaskers().catch((error) => {
//   console.error('THIS ERROR -->', error);
//   process.exit(1);
// });

async function main() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.tasker.deleteMany({});
  await prisma.rating.deleteMany({});

  // create users
  const david = await prisma.user.create({
    data: {
      id: '1234567890',
      firstname: 'david',
      lastname: 'miller',
      email: 'devid@gmail.com',
      // role: 'ADMIN',
      image: '',
      pincode: '',
    },
  });
  const john = await prisma.user.create({
    data: {
      id: '1234567891',
      firstname: 'john',
      lastname: 'miller',
      email: 'john@gmail.com',
      // role: 'ADMIN',
      image: '',
      pincode: '',
    },
  });
  const jane = await prisma.user.create({
    data: {
      id: '1234567892',
      firstname: 'jane',
      lastname: 'miller',
      email: 'jane@gmail.com',
      // role: 'ADMIN',
      image: '',
      pincode: '',
    },
  });

  // create taskers
  const rahul = await prisma.tasker.create({
    data: {
      id: '123456',
      // updatedAt: '2020-01-08',
      // createdAt: '2020-01-02',

      firstname: 'rahul',
      lastname: 'jain',
      email: 'rahul@mail.com',
      image: '',
      pincode: '123456',
      phone: '1234567890',
      permanentAddress: 'Permanent Address2',

      isVerified: false,
      hasPaidOneTimeFee: true,
      isActive: false,

      pricePerHourInRs: 350,
      experience:
        'I have over 4 years of working experience with these type of tasks. I have good understanding of english language. 2 hrs min and travel expense may be added depending on distance. I look forward to working with you soon.',
      category: TaskCategory.cleaning,
      rating: '',
      ratingCount: 0,

      area: 'Karond',

      // inContact: [],
      // assigned: [],
    },
  });
  const ankit = await prisma.tasker.create({
    data: {
      id: '123457',
      // updatedAt: '2020-01-08',
      // createdAt: '2020-01-02',

      firstname: 'jane',
      lastname: 'maxwell',
      email: 'jane1@mail.com',
      image: '',
      pincode: '123456',
      phone: '1234567891',
      permanentAddress: 'Permanent Address2',

      isVerified: false,
      hasPaidOneTimeFee: true,
      isActive: false,

      pricePerHourInRs: 100,
      experience:
        'I have over 4 years of working experience with these type of tasks. I have good understanding of english language. 2 hrs min and travel expense may be added depending on distance. I look forward to working with you soon.',
      category: TaskCategory.electrician,
      rating: '',
      ratingCount: 0,
      area: 'Karond',
      // inContact: [],
      // assigned: [],
    },
  });
  const june = await prisma.tasker.create({
    data: {
      id: '123458',
      // updatedAt: '2020-01-08',
      // createdAt: '2020-01-02',

      firstname: 'june',
      lastname: '',
      email: 'june@mail.com',
      image: '',
      pincode: '123456',
      phone: '1234567892',
      permanentAddress: 'Permanent Address2',

      isVerified: false,
      hasPaidOneTimeFee: true,
      isActive: false,

      pricePerHourInRs: 150,
      category: TaskCategory.cleaning,
      experience:
        // eslint-disable-next-line quotes
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make atype specimen book. It has survived not only five centuries",

      rating: '',
      ratingCount: 0,
      area: 'Karond',

      // inContact: [],
      // assigned: [],
    },
  });

  await prisma.tasker.update({
    where: { id: '123456' },
    data: {
      isVerified: true,
    },
  });

  console.log(JSON.stringify(taskers[0]));

  // seed justdial data
  await prisma.tasker.createMany({
    data: taskers as any,
  });

  // create tasks
  const doCleaning = await prisma.task.create({
    data: {
      id: '1',
      description: 'clean the 3rd floor rooms',
      dueDate: new Date().toISOString(),
      location: 'Location1',
      pincode: '123456',
      user: {
        connect: {
          email: david.email,
        },
      },
      taskerInContact: {
        connect: {
          email: rahul.email,
        },
      },
      // taskerAssignedId: rahul.id,
      size: 'medium',
      status: 'open',

      category: 'cleaning',
    },
  });
  const doPainting = await prisma.task.create({
    data: {
      id: '2',
      description: 'paint the 3rd floor rooms',
      dueDate: new Date().toISOString(),
      location: 'Location1',
      pincode: '123456',
      user: {
        connect: {
          email: jane.email,
        },
      },
      taskerInContact: {
        connect: {
          email: ankit.email,
        },
      },
      // taskerAssignedId: ankit.id,
      size: 'small',
      status: 'open',

      category: 'painter',
    },
  });

  // create admins
  const admin = await prisma.admin.create({
    data: {
      id: '1234567893',
      firstname: 'Prince',
      lastname: 'Agrawal',
      email: 'prince@hs.com',
      password: '123456zxc',
      // role: 'ADMIN',
      image: '',
      phone: '',
      permanentAddress: '',
    },
  });
  const admin2 = await prisma.admin.create({
    data: {
      id: '1234567894',
      firstname: 'Shubham',
      lastname: 'Verma',
      email: 'shubham@hs.com',
      password: '123456zxc',
      // role: 'ADMIN',
      image: '',
      phone: '',
      permanentAddress: '',
    },
  });

  const users = await prisma.user.findMany({
    select: {
      email: true,
      tasks: true,
    },
  });

  console.log(users);
}

// databaseSeeder()
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     // get a user from database
//     const adminUser = await prisma.user.findFirst();
//     console.log('user', adminUser);
//     await prisma.$disconnect();
//   });

main()
  .catch((error) => {
    console.error('THIS ERROR -->', error);
    process.exit(1);
  })
  .finally(async () => {
    // disconnect Prisma
    await prisma.$disconnect();
  });
