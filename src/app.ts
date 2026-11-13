import express, {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import adminFrontendRoutes from './routes/adminFrontendRoutes.ts';

import adminRoutes from './routes/adminRoutes.ts';
import enrollRoutes from './routes/enrollRoutes.ts';
import timetableRoutes from './routes/timetableRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import deviceMeRoutes from './routes/deviceMeRoutes.ts';

import { errorHandler } from './middlewares/errorHandler.ts';
import { deviceAuthHandler } from './middlewares/deviceAuthHandler.ts';

const handler404 = (req: Request, res: Response) => {
    res.status(404).json({
      status: 404,
      message: `Can not ${req.method} /api/admin${req.path}`,
    });
  }

const deviceApiRouter = express.Router();
{


  // Api router
  // Check authentication
  deviceApiRouter.use(deviceAuthHandler);

  deviceApiRouter.use(express.json());

  // Device API routes
  deviceApiRouter.use('/timetable', timetableRoutes);
  deviceApiRouter.use('/user', userRoutes);
  deviceApiRouter.use('/me', deviceMeRoutes);

  // catch all 404
  deviceApiRouter.use(handler404);
}
const adminApiRouter = express.Router();
{
  // Api router
  // Check authentication
  // adminApiRouter.use(adminAuthHandler);

  // Only parse after authentication
  adminApiRouter.use(express.json());

  // Admin API routes
  adminApiRouter.use('/', adminRoutes);

  // catch all 404
  deviceApiRouter.use(handler404);
}

const app = express();

// use api routers
app.use('/api/admin', adminApiRouter);

app.use('/api/enroll', express.json());
app.use('/api/enroll', enrollRoutes); // prevent getting the auth from device api

app.use('/api', deviceApiRouter);

// admin frontend
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(
  '/vendor/catppuccin',
  express.static(
    path.join(import.meta.dirname, '../node_modules/@catppuccin/palette/css'),
  ),
);
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.use(adminFrontendRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
