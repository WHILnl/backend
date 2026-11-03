import express from 'express';

import timetableRoutes from './routes/timetableRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import enrollRoutes from './routes/enrollRoutes.ts';

import { errorHandler } from './middlewares/errorHandler.ts';
import { authHandler } from './middlewares/authHandler.ts';

const apiRouter = express.Router();
{
  // Api router
  // Check authentication
  apiRouter.use(authHandler);

  // Only parse after authentication
  apiRouter.use(express.json());

  // Routes
  apiRouter.use('/api/timetable', timetableRoutes);
  apiRouter.use('/api/user', userRoutes);
  apiRouter.use('/api/enroll', enrollRoutes);
}

const app = express();

app.use('/api', apiRouter);
app.use(
  express.static('static', {
    // extensions: ["html"]
  }),
);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
