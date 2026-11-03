import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import config from '../config/config.ts';
import { helpers } from '../models/db.ts';
import type { device_token } from '../models/db_tables.ts';

// /api/enroll
const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  let redeemed = false;
  try {
    const body = req.body as Record<any, any>;
    if (body.enroll_code == undefined || typeof body.enroll_code != 'string') {
      return res.status(400).json({
        status: 400,
        message: "Expected field 'enroll_code' of type string in request body.",
      });
    }

    const valid = await helpers.enroll_code.validate(body.enroll_code);
    if (!valid) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid enroll code.',
      });
    }
    redeemed = await helpers.enroll_code.redeem(body.enroll_code);
    if (!redeemed) {
      return res.status(401).json({
        status: 401,
        message: 'Could not redeem enroll code.',
      });
    }
    const device_token: device_token = await helpers.device_token.generate();

    redeemed = false; // Ensure code redemption revertion is not initiated if the generated token has been sent to the client
    res.status(200).json({
      status: 200,
      message: '',
      data: {
        token_id: device_token.id,
        issued_at: device_token.issuedAt,
        token: device_token.token,
      },
    });
  } catch (error) {
    if (redeemed) {
      //TODO: revert enroll code redemption to allow retry
    }
    next(error);
  }
});

export default router;
