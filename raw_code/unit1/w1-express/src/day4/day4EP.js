// Imports --------------------------------------------------------------------
import express from "express";
import multer from "multer";
import { extname } from "path";
import httpError from "http-errors";
import uniqid from "uniqid";
import {
  getAuthors,
  writeAuthors,
  getBlogPosts,
  writeBlogPosts,
  writeAuthorPicture,
  writeBlogPostPicture,
} from "./day4lib.js";

// Routes ---------------------------------------------------------------------

const dayFourRouter = express.Router();

export default dayFourRouter
  .post(
    "/authors/:id/uploadAvatar",
    multer().single("avatar"),
    async (req, res, next) => {
      try {
        const fileExt = extname(req.file.originalname);
        const fileName = req.params.id + fileExt;
        await writeAuthorPicture(fileName, req.file.buffer);
        const url = `http://localhost:3001/img/authors/${fileName}`;
        const authors = await getAuthors();
        console.log(authors);
        const author = authors.find((author) => author.id === req.params.id);
        if (author) {
          console.log(author);
          author.avatar = url;
          await writeAuthors(authors);
          res.send({ url });
        } else {
          next(httpError(404, { message: "Author not found!" }));
        }
      } catch (error) {
        next(error);
      }
    }
  )
  .post(
    "/blogPosts/:id/uploadCover",
    multer().single("cover"),
    async (req, res, next) => {
      try {
        const fileExt = extname(req.file.originalname);
        const fileName = req.params.id + fileExt;
        await writeBlogPostPicture(fileName, req.file.buffer);
        const url = `http://localhost:3001/img/blogPosts/${fileName}`;
        const blogPosts = await getBlogPosts();
        const blogPost = blogPosts.find(
          (blogPost) => blogPost.id === req.params.id
        );
        if (blogPost) {
          blogPost.cover = url;
          await writeBlogPosts(blogPosts);
          res.send({ url });
        } else {
          next(httpError(404, { message: "Blog post not found!" }));
        }
      } catch (error) {
        next(error);
      }
    }
  )
  .get("/blogPosts/:id/comments", async (req, res, next) => {
    try {
      const blogPosts = await getBlogPosts();
      const blogPost = blogPosts.find(
        (blogPost) => blogPost.id === req.params.id
      );
      if (blogPost) {
        res.send(blogPost.comments);
      } else {
        next(httpError(404, { message: "Blog post not found!" }));
      }
    } catch (error) {
      next(error);
    }
  })
  .post("/blogPosts/:id/comments", async (req, res, next) => {
    try {
      const blogPosts = await getBlogPosts();
      const blogPost = blogPosts.find(
        (blogPost) => blogPost.id === req.params.id
      );

      if (blogPost) {
        const newComment = {
          ...req.body,
          _id: uniqid(),
        };
        blogPost.comments.push(newComment);
        await writeBlogPosts(blogPosts);
        res.status(201).send(blogPost.comments);
      } else {
        next(httpError(404, { message: "Blog post not found!" }));
      }
    } catch (error) {
      next(error);
    }
  })
  .put("/blogPosts/:id/comments/:commentId", async (req, res, next) => {
    try {
      const blogPosts = await getBlogPosts();
      const blogPost = blogPosts.find(
        (blogPost) => blogPost.id === req.params.id
      );
      if (blogPost) {
        const comment = blogPost.comments.find(
          (comment) => comment._id === req.params.commentId
        );
        if (comment) {
          const remainingComments = blogPost.comments.filter(
            (comment) => comment._id !== req.params.commentId
          );
          const updatedComment = {
            ...req.body,
            _id: req.params.commentId,
          };
          remainingComments.push(updatedComment);
          blogPost.comments = remainingComments;
          await writeBlogPosts(blogPosts);
          res.send(updatedComment);
        } else {
          next(httpError(404, { message: "Comment not found!" }));
        }
      } else {
        next(httpError(404, { message: "Blog post not found!" }));
      }
    } catch (error) {
      next(error);
    }
  })
  .delete("/blogPosts/:id/comments/:commentId", async (req, res, next) => {
    try {
      const blogPosts = await getBlogPosts();
      const blogPost = blogPosts.find(
        (blogPost) => blogPost.id === req.params.id
      );
      if (blogPost) {
        const comment = blogPost.comments.find(
          (comment) => comment._id === req.params.commentId
        );
        if (comment) {
          const remainingComments = blogPost.comments.filter(
            (comment) => comment._id !== req.params.commentId
          );
          blogPost.comments = remainingComments;
          await writeBlogPosts(blogPosts);
          res.status(204).send();
        } else {
          next(httpError(404, { message: "Comment not found!" }));
        }
      } else {
        next(httpError(404, { message: "Blog post not found!" }));
      }
    } catch (error) {
      next(error);
    }
  });
