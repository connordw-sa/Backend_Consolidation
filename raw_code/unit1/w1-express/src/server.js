import express from 'express';

import listEndPoint from 'express-list-endpoints';
import dotenv from 'dotenv';
import cors from 'cors';
import authorsRouter from './dayTwo.js';
dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use('/dayOne', authorsRouter);
const port = process.env.PORT || 3001;
console.log(listEndPoint(server));
//start server

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
