import express from "express";
import listEndPoint from "express-list-endpoints";
import dotenv from "dotenv";
import cors from "cors";
import authorsRouter from "./day2/day2EP.js";
import blogsRouter from "./day3/day3EP.js";
import dayFourRouter from "./day4/day4EP.js";
import dayFiveRouter from "./day5/day5EP.js";
import { errorHandler } from "./errorHandlers.js";

dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use("/dayTwo", authorsRouter);
server.use("/dayThree", blogsRouter);
server.use("/dayFour", dayFourRouter);
server.use("/dayFive", dayFiveRouter);
server.use(errorHandler);

const port = process.env.PORT;

server.listen(port, () => {
  console.log(listEndPoint(server));
  console.log(`Server is running on port ${port}`);
});
