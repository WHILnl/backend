import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import adminFrontendRoutes from './routes/adminFrontendRoutes.ts';

import adminRoutes from './routes/adminRoutes.ts';
import enrollRoutes from './routes/enrollRoutes.ts';
import timetableRoutes from './routes/timetableRoutes.ts';
import userRoutes from './routes/userRoutes.ts';


import { errorHandler } from './middlewares/errorHandler.ts';
import { deviceAuthHandler } from './middlewares/deviceAuthHandler.ts';

const deviceApiRouter = express.Router();
{
  // Api router
  // Check authentication
  deviceApiRouter.use(deviceAuthHandler);

  // Only parse after authentication
  deviceApiRouter.use(express.json());

  // Device API routes
  deviceApiRouter.use('/timetable', timetableRoutes);
  deviceApiRouter.use('/user', userRoutes);
  deviceApiRouter.use('/enroll', enrollRoutes);
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
}

const app = express();

// use api routers
app.use('/api/admin', adminApiRouter);
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
