import express from 'express';
import createError from 'http-errors';
import fs from 'fs-extra';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const blogsJSONPath = join(__dirname, 'blogPosts.json');

const dayThreeRouter = express.Router();

/*
The backend should include the following routes:

 

GET /blogPosts => returns the list of blogposts
GET /blogPosts /123 => returns a single blogpost
POST /blogPosts => create a new blogpost
PUT /blogPosts /123 => edit the blogpost with the given id
DELETE /blogPosts /123 => delete the blogpost with the given id
*/

export default dayThreeRouter
  .get('/blogPosts', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(blogsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileasJSON = JSON.parse(fileasAString);
      res.send(fileasJSON);
    } catch (error) {
      next(error);
    }
  })
  .get('/blogPosts/:id', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(blogsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileasJSON = JSON.parse(fileasAString);
      const blogPost = fileasJSON.find(
        (blogPost) => blogPost.id === req.params.id
      );
      if (blogPost) {
        res.send(blogPost);
      } else {
        next(createError(404, `BlogPost with id ${req.params.id} not found!`));
      }
    } catch (error) {
      next(error);
    }
  })
  .post('/blogPosts', (req, res, next) => {
    try {
      const { category, title, cover, readTime, author, content } = req.body;
      const blogPost = {
        id: uniqid(),
        category,
        title,
        cover,
        readTime,
        author,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const fileasBuffer = fs.readFileSync(blogsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileAsJSONArray = JSON.parse(fileasAString);
      fileAsJSONArray.push(blogPost);
      fs.writeFileSync(blogsJSONPath, JSON.stringify(fileAsJSONArray));
      res.status(201).send({ id: blogPost.id });
    } catch (error) {
      next(error);
    }
  })
  .put('/blogPosts/:id', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(blogsJSONPath);
      const fileasAString = fileasBuffer.toString();
      let fileasJSON = JSON.parse(fileasAString);
      const blogPostIndex = fileasJSON.findIndex(
        (blogPost) => blogPost.id === req.params.id
      );
      if (!blogPostIndex == -1) {
        res
          .status(404)
          .send({ message: `BlogPost with ${req.params.id} is not found!` });
      }
      const previousBlogPostData = fileasJSON[blogPostIndex];
      const changedBlogPost = {
        ...previousBlogPostData,
        ...req.body,
        updatedAt: new Date(),
        id: req.params.id,
      };
      fileasJSON[blogPostIndex] = changedBlogPost;
      fs.writeFileSync(blogsJSONPath, JSON.stringify(fileasJSON));
      res.send(changedBlogPost);
    } catch (error) {
      next(error);
    }
  })
  .delete('/blogPosts/:id', (req, res, next) => {
    try {
      const fileasBuffer = fs.readFileSync(blogsJSONPath);
      const fileasAString = fileasBuffer.toString();
      const fileasJSON = JSON.parse(fileasAString);
      const blogPost = fileasJSON.find(
        (blogPost) => blogPost.id === req.params.id
      );
      if (!blogPost) {
        res
          .status(404)
          .send({ message: `BlogPost with ${req.params.id} is not found!` });
      }
      const filteredBlogPosts = fileasJSON.filter(
        (blogPost) => blogPost.id !== req.params.id
      );
      fs.writeFileSync(blogsJSONPath, JSON.stringify(filteredBlogPosts));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
