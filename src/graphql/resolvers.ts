import { Context } from './context';

// import { AuthenticationError } from 'apollo-server-express';

import jwt from 'jsonwebtoken';

import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError } from 'graphql';
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

const JWT_SECRET = `${process.env.JWT_SECRET}`;

export const resolvers = {
  Query: {
    getHealth: (_parent: any, _args: any, _ctx: Context) => {
      return 'OK';
    },

    /*
      USER QUERIES 
    */
    getCurrentUser: async (_parent: any, _args: any, ctx: Context) => {
      // const token = ctx.req.cookies['jwt'] || '';

      if (ctx.user === '') {
        return null;
      }

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.sub },
        include: {
          tasks: {
            include: {
              taskerInContact: true,
              user: true,
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
      // the if the user is logged in
      // and the user is admin
      // then return all tasks otherwise throw authorization error
      if (ctx.admin === '') {
        throw new GraphQLError('Not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }

      const tasks = await ctx.prisma.task.findMany({
        include: {
          taskerInContact: true,
        },
      });

      // const tasks = await ctx.prisma.task.findMany();
      console.log('total no of tasks', tasks.length);
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

    getCurrentAdminUser: async (_parent: any, _args: any, ctx: Context) => {
      // const token = ctx.req.cookies['jwt'] || '';

      console.log('start');
      if (ctx.admin === '') {
        return null;
      }

      console.log('first');
      const currentAdminUser = await ctx.prisma.admin.findUnique({
        where: { id: ctx.admin.sub },
      });

      console.log('currentAdminUser', currentAdminUser);

      return currentAdminUser;
    },
  },

  Mutation: {
    loginWithGoogle: async (
      _parent: any,
      _args: { jwt: string },
      ctx: Context
    ) => {
      // get token from args
      const decodedToken = jwtDecode(_args.jwt) as any;

      // check if this user already exists
      let user = await ctx.prisma.user.findUnique({
        where: { id: decodedToken.sub },
        include: {
          tasks: true,
        },
      });

      // set cookie
      // const date = new Date();
      // date.setDate(date.getDate() + 7);

      // console.log('user', user);

      if (!user) {
        // if user is not already there, create one
        user = await ctx.prisma.user.create({
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
      }

      console.log('user', user);

      // sign the jwt
      const jwtSigned = jwt.sign(
        { access_types: { role: user.role } },
        Buffer.from(JWT_SECRET, 'base64'),
        { subject: user.id, expiresIn: '1d' }
      );

      // console.log('check signed jwt', jwtDecode(jwtSigned));
      console.log('signed jwt', jwtSigned);

      const options: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false, // Marks the cookie to be used with HTTPS only.
        sameSite: 'none',
        domain: process.env.ROOT_DOMAIN_NAME,
        // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      if (process.env.NODE_ENV !== 'production') {
        options.domain = process.env.APP_DOMAIN;
        // options.domain = 'localhost';
      } else {
        options.domain = process.env.ROOT_DOMAIN_NAME;
      }

      console.log('options', options);

      ctx.res.cookie('jwt', jwtSigned, options);

      return {
        ...user,
      };
    },

    // these other user mutations will need to be updated to use the new jwt
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
      // const date = new Date();
      // date.setDate(date.getDate() + 7);

      const options: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
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

            rating: '',
            ratingCount: 0,

            area: 'Karond',
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
        // taskerInContact: {
        //   connect: {
        //     email: _args.taskerInContactEmail,
        //   },
        // },
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
      console.log('task args', _args);

      const taskData: any = {
        id: _args.id,
        description: _args.description,
        dueDate: _args.dueDate,
        location: _args.location,
        pincode: _args.pincode,
        // user: {
        //   connect: {
        //     email: _args.userEmail,
        //   },
        // },
        taskerInContactId: _args.taskerInContactId,
        // taskerAssignedId: rahul.id,
        size: _args.size,
        status: _args.status,
      };

      return ctx.prisma.task.update({
        where: { id: _args.id },
        data: taskData,
        include: {
          taskerInContact: true,
        },
      });
    },

    // mutations for admin
    loginAdmin: async (
      _parent: any,
      _args: { email: string; password: string },
      ctx: Context
    ) => {
      // check if this admin user exists
      const admin = await ctx.prisma.admin.findUnique({
        where: { email: _args.email },
      });

      // if admin is not there return null
      if (!admin) {
        throw new GraphQLError('Admin not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      // check if the password is correct
      if (admin.password !== _args.password) {
        throw new GraphQLError('Password is incorrect', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      // sign the jwt
      const jwtSigned = jwt.sign(
        { access_types: { role: admin.role } },
        Buffer.from(JWT_SECRET, 'base64'),
        { subject: admin.id, expiresIn: '1d' }
      );

      const options: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false, // Marks the cookie to be used with HTTPS only.
        sameSite: 'none',
        domain: process.env.ADMIN_DASHBOARD_DOMAIN_NAME,
        // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      if (process.env.NODE_ENV !== 'production') {
        options.domain = process.env.APP_DOMAIN;
        // options.domain = 'localhost';
      } else {
        options.domain = process.env.ADMIN_DASHBOARD_DOMAIN_NAME;
      }

      console.log('options', options);

      console.log('token', jwtSigned);

      // set cookie
      ctx.res.cookie('admin_jwt', jwtSigned, options);

      return {
        ...admin,
      };
    },

    logoutAdmin: async (_parent: any, _args: any, ctx: Context) => {
      // clear the httpOnly cookie on res
      ctx.res.clearCookie('admin_jwt');

      return true;
    },

    createAdmin: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.admin.create({
        data: _args,
      });
    },

    updateAdmin: (_parent: any, _args: any, ctx: Context) => {
      return ctx.prisma.admin.update({
        where: { id: _args.id },
        data: _args,
      });
    },

    deleteAdmin: (_parent: any, _args: { id: string }, ctx: Context) => {
      return ctx.prisma.admin.delete({
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
  },
};
