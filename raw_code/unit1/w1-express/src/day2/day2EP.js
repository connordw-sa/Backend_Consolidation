// Imports --------------------------------------------------------------------
import express from "express";
import uniqid from "uniqid";
import { writeFile, findAuthorDetails, authors } from "./day2lib.js";

// Routes ---------------------------------------------------------------------

const dayTwoRouter = express.Router();

export default dayTwoRouter
  .get("/authors", (req, res, next) => {
    try {
      res.send(authors);
    } catch (error) {
      next(error);
    }
  })
  .get("/authors/:id", (req, res, next) => {
    try {
      const author = findAuthorDetails("id", req.params.id);
      if (!author)
        return res
          .status(404)
          .send({ message: `Author with ID ${req.params.id} not found!` });
      res.send(author);
    } catch (error) {
      next(error);
    }
  })
  .post("/authors", (req, res, next) => {
    try {
      const authorSameEmail = findAuthorDetails("email", req.body.email);
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
  .put("/authors/:id", (req, res, next) => {
    try {
      const authorIndex = findAuthorDetails("id", req.params.id, true);
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
  .delete("/authors/:id", (req, res, next) => {
    try {
      const authorIndex = findAuthorDetails("id", req.params.id, true);
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
