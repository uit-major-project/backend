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
  let decoded = '';

  const token = req.headers.authorization || '';

  const tokenCookie = req.header['jwt'] || '';

  console.log('token cookie from context', tokenCookie);
  console.log('token header from context', token);

  if (token !== '') {
    decoded = jwtDecode(token);

    console.log('token', decoded);
  } else if (tokenCookie !== '') {
    decoded = jwtDecode(tokenCookie);

    console.log('token cookie', decoded);
  }

  // const user = req.user || null;
  // console.log('res', res);
  // console.log('user', user);
  return {
    req,
    res,
    prisma,
    user: decoded,
  };
}
// export async function(req: any):Promise<any> {

// }
