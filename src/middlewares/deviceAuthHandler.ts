import type { Request, Response, NextFunction } from 'express';

import { db, helpers } from '../models/db.ts';
import type { device_token } from '../models/db_tables.ts';

function unauthenticated(res: Response, msg?: string) {
  res.status(401).json({
    status: 401,
    message: msg || 'Unauthenticated',
  });
}

export const deviceAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (authHeader == undefined) {
    unauthenticated(res, 'No HTTP Authorization header present.');
    return;
  }

  let firstSpace: number = authHeader.indexOf(' ');
  firstSpace = firstSpace == -1 ? authHeader.length : firstSpace;
  const type: string = authHeader.substring(0, firstSpace);
  if (type.toLowerCase() != 'bearer') {
    unauthenticated(
      res,
      `Unsuported authentication scheme '${type}', please use 'Bearer' scheme`,
    );
  }
  const token: string = authHeader.substring(firstSpace + 1);
  const validatedToken = await helpers.device_token.validateAndUpdateLastUsed(token);
  if (!validatedToken) {
    unauthenticated(res);
    return;
  }

  //@ts-ignore
  req.session = {
    token: validatedToken
  }

  next();
};
