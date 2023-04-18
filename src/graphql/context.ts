import { PrismaClient } from '@prisma/client';
import jwtDecode from 'jwt-decode';
// import { request } from 'http';
import prisma from '../../lib/prisma';

export type Context = {
  prisma: PrismaClient;
  req: any;
  res: any;
  user: any;
};

export async function createContext({ req, res }: any): Promise<any> {
  const token = req.cookies['jwt'] || '';

  if (token !== '') {
    const decoded = jwtDecode(token);

    console.log('token', decoded);
  }

  // const user = req.user || null;
  // console.log('res', res);
  // console.log('user', user);
  return {
    req,
    res,
    prisma,
    // decoded,
  };
}
// export async function(req: any):Promise<any> {

// }
