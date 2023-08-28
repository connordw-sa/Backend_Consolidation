// Imports --------------------------------------------------------------------

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

// Variables ------------------------------------------------------------------

const { readJSON, writeJSON, writeFile } = fs;

const publicFolderAuthorPath = join(process.cwd(), "./public/img/authors");
const publicFolderBlogPostPath = join(process.cwd(), "./public/img/blogPosts");

const authorsJSONPath = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "authors.json"
);

const blogPostsJSONPath = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "blogPosts.json"
);

export const getAuthors = async () => await readJSON(authorsJSONPath);

export const writeAuthors = async (content) =>
  await writeJSON(authorsJSONPath, content);

export const getBlogPosts = async () => await readJSON(blogPostsJSONPath);

export const writeBlogPosts = async (content) =>
  await writeJSON(blogPostsJSONPath, content);

export const writeAuthorPicture = async (fileName, content) =>
  await writeFile(join(publicFolderAuthorPath, fileName), content);

export const writeBlogPostPicture = async (fileName, content) =>
  await writeFile(join(publicFolderBlogPostPath, fileName), content);
