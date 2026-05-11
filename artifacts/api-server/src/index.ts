import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";
import { env } from "./config/env";
import { testConnection } from "./config/database";

async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }


    // Start server
    app.listen(env.PORT, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({
        port: env.PORT,
        nodeEnv: env.NODE_ENV,
        corsOrigin: env.CORS_ORIGIN
      }, "Server listening");
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
