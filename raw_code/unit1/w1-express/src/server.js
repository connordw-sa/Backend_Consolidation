import express from 'express';
import listEndPoint from 'express-list-endpoints';
import dotenv from 'dotenv';
import cors from 'cors';
import authorsRouter from './day2EP.js';
import blogsRouter from './day3EP.js';

dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use('/dayTwo', authorsRouter);
server.use('/dayThree', blogsRouter);

const port = process.env.PORT || 3001;
console.log(listEndPoint(server));

//start server

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
