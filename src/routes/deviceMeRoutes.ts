import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import config from '../config/config.ts';
import { helpers } from '../models/db.ts';
import type { device_token } from '../models/db_tables.ts';

// /api/me
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const deviceToken = req.session.token as device_token;
    res.status(200).json({
        id: deviceToken.id,
        issuedAt: deviceToken.issuedAt
    });
  } catch (error) {
    next(error);
  }
});

export default router;
