import { PrismaClient } from '@prisma/client';
// import jwtDecode from 'jwt-decode';
// import { request } from 'http';
import prisma from '../../lib/prisma';

import jwt from 'jsonwebtoken';

export type Context = {
  prisma: PrismaClient;
  req: any;
  res: any;
  user: any;
  admin: any;
};

const JWT_SECRET = `${process.env.JWT_SECRET}`;

export async function createContext({ req, res }: any): Promise<any> {
  let decoded: any = '';

  const tokenCookie = req.header['jwt'] || '';
  const token = req.headers.authorization.split(' ')[1] || '';

  console.log('token cookie from context', tokenCookie);
  console.log('token header from context', token);

  try {
    if (token !== '') {
      // decoded = jwt.verify(token, new Buffer(JWT_SECRET, 'base64'))
      decoded = jwt.decode(token);

      console.log('token', decoded);
    } else if (tokenCookie !== '') {
      // decoded = jwt.verify(tokenCookie, new Buffer(JWT_SECRET, 'base64'))

      decoded = jwt.decode(tokenCookie);

      console.log('token cookie', decoded);
    }
  } catch (error) {
    console.log('error in context', error);
  }

  let adminDecoded = '';
  let userDecoded = '';

  // check token expiry time
  // const tokenExpiryTime = decoded.exp;

  // check if the role is user or admin
  if (decoded !== '' && decoded?.access_types?.role === 'admin') {
    adminDecoded = decoded;
  } else if (decoded !== '' && decoded?.access_types?.role === 'user') {
    userDecoded = decoded;
  }

  // const user = req.user || null;
  // console.log('res', res);
  // console.log('user', user);
  return {
    req,
    res,
    prisma,
    user: userDecoded,
    admin: adminDecoded,
  };
}
// export async function(req: any):Promise<any> {

// }
