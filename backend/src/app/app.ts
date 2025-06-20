import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";

import cookieParser from "cookie-parser";
import { sendErrorResponse } from "./shared/response";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://gadget-galaxy-phi.vercel.app/"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use;

app.use("/api/v1", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  sendErrorResponse(res, {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong",
  });
});

app.use((req, res) => {
  if (req.url === "/") {
    res.status(200).json({
      message: "Hey welcome to  server",
    });
  }
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
});
export default app;
