import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';

// /
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.render('index', {
        title: 'Admin Panel'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
