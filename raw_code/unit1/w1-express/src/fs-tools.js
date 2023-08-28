import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;
const publicFolderPath = join(process.cwd(), "./public/img");
const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

export const getAuthors = async () => await readJSON(authorsJSONPath);
export const writeAuthors = async (content) =>
  await writeJSON(authorsJSONPath, content);
export const getBlogPosts = async () => await readJSON(blogPostsJSONPath);
export const writeBlogPosts = async (content) =>
  await writeJSON(blogPostsJSONPath, content);
export const writeAuthorsPicture = async (fileName, contentAsABuffer) =>
  await writeFile(join(publicFolderPath, fileName), contentAsABuffer);
