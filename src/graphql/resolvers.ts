import { Context } from './context';

import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
export const resolvers = {
  Query: {
    /*
      USER QUERIES 
    */
    getCurrentUser: async (_parent: any, _args: any, ctx: Context) => {
      // const token = ctx.req.cookies['jwt'] || '';

      if (_args.jwt === '') {
        return null;
      }

      const decodedToken: any = jwtDecode(_args.jwt);

      console.log('decodedToken from cu', decodedToken);

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: decodedToken.sub },
        include: {
          tasks: {
            include: {
              taskerInContact: true,
            },
          },
        },
      });

      console.log('currentUser', currentUser);

      return currentUser;
    },

    users: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.user.findMany({
        include: {
          tasks: {
            include: {
              taskerInContact: true,
            },
          },
        },
      });
    },
    user: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.user.findUnique({
        where: { id: _args.id },
        include: {
          tasks: true,
        },
      });
    },

    /*
      TASKER QUERIES
    */
    taskers: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.tasker.findMany();
    },
    tasker: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.tasker.findUnique({
        where: { id: _args.id },
      });
    },

    /*
      TASK QUERIES 
    */
    tasks: async (_parent: any, _args: any, ctx: Context) => {
      const tasks = await ctx.prisma.task.findMany();

      // const tasks = await ctx.prisma.task.findMany();
      console.log('tasks', tasks);
      return tasks;
    },
    task: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.task.findUnique({
        where: { id: _args.id },
      });
    },
    tasksByUserId: async (_parent: any, _args: any, ctx: Context) => {
      const tasks = await ctx.prisma.task.findMany({
        where: { userId: _args.userId },
        include: {
          taskerInContact: true,
        },
      });

      console.log('tasks', tasks);
      return tasks;
    },
  },

  Mutation: {
    loginWithGoogle: async (
      _parent: any,
      _args: { jwt: string },
      ctx: Context
    ) => {
      // decode the jwt
      const decodedToken: any = jwtDecode(_args.jwt);

      console.log('decoded token: ', decodedToken);

      // check if this user already exists
      const user = await ctx.prisma.user.findUnique({
        where: { id: decodedToken.sub },
        include: {
          tasks: true,
        },
      });

      // set cookie
      const date = new Date();
      date.setDate(date.getDate() + 7);

      const options: any = {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === 'production' ? true : false,
        // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      };

      if (process.env.NODE_ENV !== 'production') {
        // options.domain = process.env.APP_DOMAIN;
        options.domain = 'localhost';
      } else {
        options.domain = process.env.ROOT_DOMAIN_NAME;
      }

      console.log('options', options);

      ctx.res.cookie('jwt', _args.jwt, options);

      // console.log('user', user);

      if (!user) {
        // if user is not already there, create one and return it
        const newUser = await ctx.prisma.user.create({
          data: {
            id: decodedToken.sub,
            firstname: decodedToken.given_name,
            lastname: decodedToken.family_name,
            email: decodedToken.email,
            image: decodedToken.picture,
            // tasks: [] as any,
          },
          include: {
            tasks: true,
          },
        });
        // console.log('newUser', newUser);
        return {
          ...newUser,
        };
      } else {
        // console.log('user', user);
        // return the user
        return {
          ...user,
        };
      }
    },

    createUser: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.user.create({
        data: _args,
        include: {
          tasks: true,
        },
      });
    },
    updateUser: (_parent: any, _args: any, ctx: Context) => {
      console.log('_args', _args);
      return ctx.prisma.user.update({
        where: { id: _args.id },
        data: { ..._args, updatedAt: new Date().toISOString() },
        include: {
          tasks: {
            include: {
              taskerInContact: true,
            },
          },
        },
      });
    },
    deleteUser: (_parent: any, _args: { id: string }, ctx: Context) => {
      return ctx.prisma.user.delete({
        where: { id: _args.id },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          image: true,
          phone: true,
          permanentAddress: true,
        },
      });
    },

    // task resolvers
    // createTask: (_parent: any, _args: any, ctx: Context) => {
    //   return ctx.prisma.task.create({
    //     data: _args,
    //   });
    // },

    // tasker resolvers
    taskerLoginWithGoogle: async (
      _parent: any,
      _args: { jwt: string },
      ctx: Context
    ) => {
      // decode the jwt
      const decodedToken: any = jwtDecode(_args.jwt);

      console.log('TASKER TOKEN DECODED: ', decodedToken);

      // check if this user already exists
      const tasker = await ctx.prisma.tasker.findUnique({
        where: { id: decodedToken.sub },
      });

      // set cookie
      const date = new Date();
      date.setDate(date.getDate() + 7);

      const options: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      };

      if (process.env.NODE_ENV !== 'production') {
        // options.domain = process.env.APP_DOMAIN;
        options.domain = 'localhost';
      } else {
        options.domain = process.env.ROOT_DOMAIN_NAME;
      }

      console.log('options', options);

      // console.log('user', user);

      if (!tasker) {
        // if tasker is not already there, create one and return it
        const newTasker = await ctx.prisma.tasker.create({
          data: {
            id: decodedToken.sub,
            firstname: decodedToken.given_name,
            lastname: decodedToken.family_name,
            email: decodedToken.email,
            image: decodedToken.picture,

            isVerified: false,
            hasPaidOneTimeFee: false,
            isActive: false,
            // tasks: [] as any,
          },
        });
        // console.log('newUser', newUser);
        return {
          tasker: newTasker,
          hasAccount: false,
        };
      } else {
        // console.log('tasker', tasker);
        // return the tasker and set the login cookie
        ctx.res.cookie('tasker_jwt', _args.jwt, options);
        return {
          tasker: tasker,
          hasAccount: true,
          message: 'logged in',
        };
      }
    },

    createTasker: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.tasker.create({
        data: _args,
      });
    },
    updateTasker: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.tasker.update({
        where: { id: _args.id },
        data: _args,
      });
    },

    createTask: (_parent: any, _args: any, ctx: Context) => {
      // const id = String(Math.floor(Math.random() * 10));

      // const args = _args;

      console.log('task args', _args);

      const taskData: any = {
        id: uuidv4(),
        description: _args.description,
        dueDate: _args.dueDate,
        location: _args.location,
        pincode: _args.pincode,
        user: {
          connect: {
            email: _args.userEmail,
          },
        },
        taskerInContact: {
          connect: {
            email: _args.taskerInContactEmail,
          },
        },
        // taskerAssignedId: rahul.id,
        size: _args.size,
        status: 'open',
        category: _args.category,
      };

      return ctx.prisma.task.create({
        data: taskData,
        include: {
          user: true,
          taskerInContact: true,
        },
      });
    },
    updateTask: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.task.update({
        where: { id: _args.id },
        data: _args,
        include: {
          taskerInContact: true,
        },
      });
    },
  },
};
