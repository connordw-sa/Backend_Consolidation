// Imports --------------------------------------------------------------------
import express from 'express';
import createError from 'http-errors';
import fs from 'fs-extra';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { checkSchema, validationResult } from 'express-validator';

// Variables ------------------------------------------------------------------
const dayThreeRouter = express.Router();

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'blogPosts.json'
);

const blogPosts = JSON.parse(fs.readFileSync(blogPostsJSONPath));

function writeFile(updatedBlogPosts) {
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(updatedBlogPosts));
}

function findBlogPostDetails(property, value, returnIndex = false) {
  return returnIndex
    ? blogPosts.findIndex((blogPost) => blogPost[property] === value)
    : blogPosts.find((blogPost) => blogPost[property] === value);
}

// Schema ---------------------------------------------------------------------

const blogSchema = {
  category: {
    in: ['body'],
    isString: {
      errorMessage: 'Category is required',
    },
  },
  title: {
    in: ['body'],
    isString: {
      errorMessage: 'Title is required',
    },
  },
};

const checkBlogPostSchema = checkSchema(blogSchema);

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      createError(400, 'Error during blog post validation', { message: errors })
    );
  } else {
    next();
  }
}; 

// Routes ---------------------------------------------------------------------
export default dayThreeRouter
  .get('/blogPosts', (req, res, next) => {
    try {
      const { title, authorName } = req.query;
      const filteredPosts = title
        ? blogPosts.filter((blogPost) =>
            blogPost.title.toLowerCase().includes(title.toLowerCase())
          )
        : authorName
        ? blogPosts.filter((blogPost) =>
            blogPost.author.name
              .toLowerCase()
              .includes(authorName.toLowerCase())
          )
        : blogPosts;
      const message =
        (title && `No blogposts with title '${title}' found.`) ||
        (authorName && `No blogposts by author '${authorName}' found.`);
      res.send(filteredPosts.length === 0 ? { message } : filteredPosts);
    } catch (error) {
      next(error);
    }
  })
  .get('/blogPosts/:id', (req, res, next) => {
    try {
      const blogPost = findBlogPostDetails('id', req.params.id);
      if (!blogPost)
        return res
          .status(404)
          .send({ message: `Blog post with ID ${req.params.id} not found!` });
      res.send(blogPost);
    } catch (error) {
      next(error);
    }
  })
  .post(
    '/blogPosts',
    checkBlogPostSchema,
    checkValidationResult,
    (req, res, next) => {
      try {
        const blogPost = {
          ...req.body,
          id: uniqid(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        blogPosts.push(blogPost);
        writeFile(blogPosts);
        res.status(201).send(blogPost);
      } catch (error) {
        next(error);
      }
    }
  )
  .put(
    '/blogPosts/:id',
    checkBlogPostSchema,
    checkValidationResult,
    (req, res, next) => {
      try {
        const blogPostIndex = findBlogPostDetails('id', req.params.id, true);
        if (blogPostIndex === -1)
          return res
            .status(404)
            .send({ message: `Blog post with ID ${req.params.id} not found!` });
        const previousBlogPostDetails = blogPosts[blogPostIndex];
        const updatedBlogPost = {
          ...previousBlogPostDetails,
          ...req.body,
          updatedAt: new Date(),
        };
        blogPosts[blogPostIndex] = updatedBlogPost;
        writeFile(blogPosts);
        res.send(updatedBlogPost);
      } catch (error) {
        next(error);
      }
    }
  )
  .delete('/blogPosts/:id', (req, res, next) => {
    try {
      const blogPostIndex = findBlogPostDetails('id', req.params.id, true);
      if (blogPostIndex === -1)
        return res
          .status(404)
          .send({ message: `Blog post with ID ${req.params.id} not found!` });
      blogPosts.splice(blogPostIndex, 1);
      writeFile(blogPosts);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
