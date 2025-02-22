import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { setupRoutes } from './api/routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

export default app; 