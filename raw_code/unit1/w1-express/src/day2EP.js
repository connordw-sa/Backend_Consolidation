import express from 'express';
import createError from 'http-errors';
import fs from 'fs-extra';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'authors.json'
);

const fileasBuffer = fs.readFileSync(authorsJSONPath);
const fileasAString = fileasBuffer.toString();
const fileasJSON = JSON.parse(fileasAString);
const writeFile = fs.writeFileSync(authorsJSONPath, JSON.stringify(fileasJSON));

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
      fileasBuffer;
      fileasAString;
      fileasJSON;
      res.send(fileasJSON);
    } catch (error) {
      next(error);
    }
  })
  .get('/authors/:id', (req, res, next) => {
    try {
      fileasBuffer;
      fileasAString;
      fileasJSON;
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

      fileasBuffer;
      fileasAString;
      fileasJSON;
      fileasJSON.push(author);
      writeFile;
      res.status(201).send({ id: author.id });
    } catch (error) {
      next(error);
    }
  })
  .put('/authors/:id', (req, res, next) => {
    try {
      fileasBuffer;
      fileasAString;
      fileasJSON;
      const authorIndex = fileasJSON.findIndex(
        (author) => author.id === req.params.id
      );
      if (!authorIndex == -1) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} not found!` });
      }
      const previousAuthorData = fileasJSON[authorIndex];
      const changedAuthor = {
        ...previousAuthorData,
        ...req.body,
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileasJSON[authorIndex] = changedAuthor;
      writeFile;
      res.send(changedAuthor);
    } catch (error) {
      next(error);
    }
  })
  .delete('/authors/:id', (req, res, next) => {
    try {
      fileasBuffer;
      fileasAString;
      fileasJSON;
      const author = fileasJSON.find((author) => author.id === req.params.id);
      if (!author) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.id} not found!` });
      }
      const filteredAuthors = fileasJSON.filter(
        (author) => author.id !== req.params.id
      );
      fs.writeFileSync(authorsJSONPath, JSON.stringify(filteredAuthors));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
