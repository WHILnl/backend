import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { db } from '../models/db.ts';
import type { device_token, enroll_code } from '../models/db_tables.ts';

// /api/admin
const router = Router();

router.get(
  '/device_token',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      db.all('SELECT * FROM device_tokens', (err, rows: device_token[]) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
          });
        }

        res.status(200).json({
          status: 200,
          message: "",
          data: rows
        })
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
