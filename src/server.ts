import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`[Server] running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`[Server] CORS configured for origin: ${env.FRONTEND_ORIGIN}`);
});
