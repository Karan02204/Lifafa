import express from "express";
import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth.route";
import { errorMiddleware } from "./middleware/error.middleware";
import passport from "./config/passport";


const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use("/health" , healthRouter);
app.use("/auth" , authRouter);


app.use(errorMiddleware);
export default app;