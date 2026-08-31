import express from "express";
import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import passport from "./config/passport";
import userRouter from "./routes/user.route";
import emailRouter from "./routes/email.route";
import senderRouter from "./routes/sender.route";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";

const app = express();

app.use(helmet());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

const allowedOrigins = env.FRONTEND_URL.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser or same-origin
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".e2b.app")) {
        return cb(null, true);
      }
      // In dev allow all
      if (env.NODE_ENV !== "production") return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/emails", emailRouter);
app.use("/api/senders", senderRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);
export default app;
