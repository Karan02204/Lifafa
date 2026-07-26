import express from "express";
import healthRoutes from "./routes/health.route";
import { errorMiddleware } from "./middleware/error.middleware";


const app = express();

app.use(express.json());

app.use("/health" , healthRoutes);



app.use(errorMiddleware);
export default app;