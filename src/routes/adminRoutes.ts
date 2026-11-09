import { Router, type RequestHandler } from 'express';
import { db, helpers } from '../models/db.ts';
import type { device_token, enroll_code } from '../models/db_tables.ts';
import config from '../config/config.ts';

// /api/admin
const router = Router();

// DEVICE TOKEN
router.get('/device_token', (async (req, res, next) => {
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
        message: '',
        data: rows,
      });
    });
  } catch (error) {
    next(error);
  }
}) satisfies RequestHandler);

router.get('/device_token/:id', (async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: ':id must be a number.',
      });
    }
    db.get(
      'SELECT * FROM device_tokens WHERE id = ?',
      id,
      (err, row: device_token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
          });
        }

        res.status(200).json({
          status: 200,
          message: '',
          data: row,
        });
      },
    );
  } catch (error) {
    next(error);
  }
}) satisfies RequestHandler);
router.post('/device_token/:id/revoke', (async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: ':id must be a number.',
      });
    }
    db.get(
      'UPDATE device_tokens SET revokedAt = unixepoch("now") WHERE id = ?',
      id,
      (err, row: device_token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
          });
        }

        res.status(200).json({
          status: 200,
          message: '',
          data: row,
        });
      },
    );
  } catch (error) {
    next(error);
  }
}) satisfies RequestHandler);

// ENROLL CODE
router.get('/enroll_code', (async (req, res, next) => {
  try {
    db.all('SELECT * FROM enroll_codes', (err, rows: enroll_code[]) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          status: 500,
          message: 'Internal Server Error',
        });
      }

      res.status(200).json({
        status: 200,
        message: '',
        data: rows,
      });
    });
  } catch (error) {
    next(error);
  }
}) satisfies RequestHandler);
router.post('/enroll_code', (async (req, res, next) => {
  try {
    const body = req.body;
    if (!(
      body &&
      body instanceof Object &&
      'total_uses' in body &&
      typeof body.total_uses == 'number'
    )) {
      return res.status(400).json({
        status: 400,
        message: "Expected json with key 'total_uses' as number",
      });
    }
    if (!(body.duration == undefined || typeof body.duration == 'number')) {
      return res.status(400).json({
        status: 400,
        message:
          "Optional key 'duration' must be a number, specified in seconds",
      });
    }
    if (body.duration > config.enroll_code_duration / 1000) {
      return res.status(400).json({
        status: 400,
        message: `Optional 'duration' may not be more than the default duration (${config.enroll_code_duration / 1000}s), specified in seconds`,
      });
    }
    const enroll_code = await helpers.enroll_code.generate(
      body.total_uses,
      body.duration,
    );

    res.status(200).json({
      status: 200,
      message: '',
      data: enroll_code,
    });
  } catch (error) {
    next(error);
  }
}) satisfies RequestHandler);

router.get('/enroll_code/:id', (async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: ':id must be a number.',
      });
    }
    db.get(
      'SELECT * FROM enroll_codes WHERE id = ?',
      id,
      (err, row: enroll_code) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
          });
        }

        res.status(200).json({
          status: 200,
          message: '',
          data: row,
        });
      },
    );
  } catch (error) {
    next(error);
  }
}) satisfies RequestHandler);
router.delete('/enroll_code/:id', (async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: ':id must be a number.',
      });
    }
    db.get(
      'DELETE FROM enroll_codes WHERE id = ?',
      id,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
          });
        }

        res.status(200).json({
          status: 200,
          message: 'Deleted.',
        });
      },
    );
  } catch (error) {
    next(error);
  }
}) satisfies RequestHandler);

export default router;
