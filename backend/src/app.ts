import express from "express";
import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import passport from "./config/passport";
import userRouter from "./routes/user.route";
import emailRouter from "./routes/email.route";

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/emails", emailRouter);

app.use(errorMiddleware);
export default app;
