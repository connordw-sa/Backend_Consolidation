//day 2

import express from 'express';
import createError from 'http-errors';
import fs from 'fs-extra';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const authorsJSONPath = join(__dirname, 'authors.json');

const dayTwoRouter = express.Router();

/*The backend should include the following routes:

 

GET /authors => returns the list of authors
GET /authors/123 => returns a single author
POST /authors => create a new author
PUT /authors/123 => edit the author with the given id
DELETE /authors/123 => delete the author with the given id*/

export default dayTwoRouter
  .get('/authors', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(authorsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileasJSON = JSON.parse(fileasAString);
      res.send(fileasJSON);
    } catch (error) {
      next(error);
    }
  })
  .get('/authors/:id', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(authorsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileasJSON = JSON.parse(fileasAString);
      const author = fileasJSON.find((author) => author.id === req.params.id);
      if (author) {
        res.send(author);
      } else {
        next(createError(404, `Author with id ${req.params.id} not found!`));
      }
    } catch (error) {
      next(error);
    }
  })
  .post('/authors', (req, res, next) => {
    try {
      const { name, surname, email, dateOfBirth } = req.body;
      const fileAsJson = JSON.parse(fs.readFileSync(authorsJSONPath));
      const existingEmail = fileAsJson.find((author) => author.email === email);
      if (existingEmail) {
        res.status(400).send({ message: 'Email already in use!' });
      }

      const author = {
        id: uniqid(),
        name,
        surname,
        email,
        dateOfBirth,
        avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const fileasBuffer = fs.readFileSync(authorsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileAsJSONArray = JSON.parse(fileasAString);
      fileAsJSONArray.push(author);
      fs.writeFileSync(authorsJSONPath, JSON.stringify(fileAsJSONArray));
      res.status(201).send({ id: author.id });
    } catch (error) {
      next(error);
    }
  })
  .put('/authors/:id', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(authorsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileAsJSONArray = JSON.parse(fileasAString);
      const authorIndex = fileAsJSONArray.findIndex(
        (author) => author.id === req.params.id
      );
      if (!authorIndex == -1) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} not found!` });
      }
      const previousAuthorData = fileAsJSONArray[authorIndex];
      const changedAuthor = {
        ...previousAuthorData,
        ...req.body,
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileAsJSONArray[authorIndex] = changedAuthor;
      fs.writeFileSync(authorsJSONPath, JSON.stringify(fileAsJSONArray));
      res.send(changedAuthor);
    } catch (error) {
      next(error);
    }
  })
  .delete('/authors/:id', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(authorsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileAsJSONArray = JSON.parse(fileasAString);
      const author = fileAsJSONArray.find(
        (author) => author.id === req.params.id
      );
      if (!author) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} not found!` });
      }
      const filteredAuthors = fileAsJSONArray.filter(
        (author) => author.id !== req.params.id
      );
      fs.writeFileSync(authorsJSONPath, JSON.stringify(filteredAuthors));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
