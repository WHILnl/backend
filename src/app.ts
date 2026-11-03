import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import adminFrontendRoutes from './routes/adminFrontendRoutes.ts';

import adminRoutes from './routes/adminRoutes.ts';
import enrollRoutes from './routes/enrollRoutes.ts';
import timetableRoutes from './routes/timetableRoutes.ts';
import userRoutes from './routes/userRoutes.ts';


import { errorHandler } from './middlewares/errorHandler.ts';
import { authHandler } from './middlewares/authHandler.ts';

const apiRouter = express.Router();
{
  // Api router
  // Check authentication
  apiRouter.use(authHandler);

  // Only parse after authentication
  apiRouter.use(express.json());

  // Device API routes
  apiRouter.use('/api/timetable', timetableRoutes);
  apiRouter.use('/api/user', userRoutes);
  apiRouter.use('/api/enroll', enrollRoutes);
  // Admin API routes
  apiRouter.use('/api/admin', adminRoutes);
}

const app = express();

// use api router
app.use('/api', apiRouter);

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
