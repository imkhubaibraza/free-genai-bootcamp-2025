import app from './app';
import { initializeDatabase } from './utils/database';
import { seedDatabase } from './db/seeds';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Seed database in development
    if (process.env.NODE_ENV !== 'production') {
      await seedDatabase();
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 