import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import initDb from "./config/db";
import { SessionAuthority } from "./security/session-authority";
import { getApiRouter } from "./routes/index";
import { catchAllMiddleware, notFoundMiddleware } from "./middleware/error-middleware";

(async () => {
  dotenv.config();

  const app = express();
  const port = process.env.PORT || 5000;

  if (!await initDb()) {
    process.exit(1);
  }

  app.use(cors());
  app.use(express.json());

  const sessionAuthority = new SessionAuthority();
  app.use(getApiRouter(sessionAuthority));

  app.use(notFoundMiddleware);
  app.use(catchAllMiddleware);

  app.listen(port, () => console.log(`API on http://localhost:${port}`));
})();
