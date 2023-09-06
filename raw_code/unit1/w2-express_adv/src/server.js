import express from "express";
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./day3/day3EP.js";
const server = express();

server.use(express.json());

server.use("/dayThree", blogsRouter);

const port = 3005;

server.listen(port, () => {
  console.log(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});

process.on("SIGINT", () => {
  console.log("Bye bye! (Ctrl+C)");
  process.exit();
});
