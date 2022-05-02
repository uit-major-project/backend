import { PrismaClient } from '@prisma/client';
// import { request } from 'http';
import prisma from '../../lib/prisma';

export type Context = {
  prisma: PrismaClient;
  req: any;
  res: any;
};

export async function createContext({ req, res }: any): Promise<any> {
  // const token = req.cookies['jwt'] || '';

  // console.log('token', token);

  // const user = req.user || null;
  // console.log('res', res);
  // console.log('user', user);
  return {
    req,
    res,
    prisma,
  };
}
// export async function(req: any):Promise<any> {

// }
