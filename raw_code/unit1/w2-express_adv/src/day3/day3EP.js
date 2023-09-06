// BACKEND
// Create an endpoint dedicated to export all the relevant data of a blog post into a well styled downloadable PDF file.

// [EXTRA] add blogpost image to PDF too
import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { get } from "http";

const { readJSON, writeJSON, writeFile } = fs;

const day3Router = express.Router();

const blogPostsJSONPath = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "blogPosts.json"
);

const getBlogPosts = async () => await readJSON(blogPostsJSONPath);

const writeBlogPosts = async (content) =>
  await writeJSON(blogPostsJSONPath, content);

export default day3Router.post("/blogpost", async (req, res, next) => {
  try {
    const newBlogPost = { ...req.body, createdAt: new Date() };
    const blogPosts = await getBlogPosts();
    blogPosts.push(newBlogPost);
    await writeBlogPosts(blogPosts);

    res.status(201).send(newBlogPost);
  } catch (error) {
    next(error);
  }
});
