import express from "express";
import { authRouter } from "./router/auth.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

await mongoose.connect(process.env.MONGO_URL);
console.log("connected to mongodb");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.error("failed to start http-server, got", err);
    process.exit(1);
  }
  console.log(`http server started @ :${process.env.PORT}`);
});
