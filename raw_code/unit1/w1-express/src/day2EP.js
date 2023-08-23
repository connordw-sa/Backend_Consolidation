import express from 'express';
import fs from 'fs-extra';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dayTwoRouter = express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'authors.json'
);

const fileasBuffer = fs.readFileSync(authorsJSONPath);

const authors = JSON.parse(fileasBuffer);

function findAuthorDetails(property, value, returnIndex = false) {
  if (returnIndex) {
    return authors.findIndex((author) => author[property] === value);
  }
  return authors.find((author) => author[property] === value);
}

function writeFile(updatedAuthors) {
  fs.writeFileSync(authorsJSONPath, JSON.stringify(updatedAuthors));
}

export default dayTwoRouter
  .get('/authors', (req, res, next) => {
    try {
      res.send(authors);
    } catch (error) {
      next(error);
    }
  })
  .get('/authors/:id', (req, res, next) => {
    try {
      const author = findAuthorDetails('id', req.params.id);
      if (!author)
        return res
          .status(404)
          .send({ message: `Author with ID ${req.params.id} not found!` });
      res.send(author);
    } catch (error) {
      next(error);
    }
  })

  .post('/authors', (req, res, next) => {
    try {
      const authorSameEmail = findAuthorDetails('email', req.body.email);
      if (authorSameEmail) {
        return res
          .status(409)
          .send({ message: `Email ${authorSameEmail.email} already in use!` });
      }
      const author = {
        ...req.body,
        id: uniqid(),
        avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      authors.push(author);
      writeFile(authors);
      res.status(201).send({ id: author.id });
    } catch (error) {
      next(error);
    }
  })
  .put('/authors/:id', (req, res, next) => {
    try {
      const authorIndex = findAuthorDetails('id', req.params.id, true);
      if (authorIndex === -1) {
        return res
          .status(404)
          .send({ message: `Author with ${req.params.id} not found!` });
      }
      const changedAuthor = {
        ...authors[authorIndex],
        ...req.body,
        updatedAt: new Date(),
      };
      authors[authorIndex] = changedAuthor;
      writeFile(authors);
      res.status(200).send(changedAuthor);
    } catch (error) {
      next(error);
    }
  })

  .delete('/authors/:id', (req, res, next) => {
    try {
      const authorIndex = findAuthorDetails('id', req.params.id, true);
      if (authorIndex === -1) {
        return res
          .status(404)
          .send({ message: `Author with ${req.params.id} not found!` });
      }
      authors.splice(authorIndex, 1);
      writeFile(authors);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
