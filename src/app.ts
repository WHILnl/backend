import express from 'express';

import timetableRoutes from './routes/timetableRoutes.ts';
import userRoutes from './routes/userRoutes.ts';

import { errorHandler } from './middlewares/errorHandler.ts';

const app = express();

app.use(express.json());

// Routes
app.use('/api/timetable', timetableRoutes);
app.use('/api/user', userRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;