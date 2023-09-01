// Imports --------------------------------------------------------------------
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import createError from "http-errors";
// import { checkSchema, validationResult } from "express-validator";
// Variables ------------------------------------------------------------------

const blogPostsJSONPath = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "blogPosts.json"
);

export const blogPosts = JSON.parse(fs.readFileSync(blogPostsJSONPath));

export function writeFile(updatedBlogPosts) {
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(updatedBlogPosts));
}

export function findBlogPostDetails(property, value, returnIndex = false) {
  return returnIndex
    ? blogPosts.findIndex((blogPost) => blogPost[property] === value)
    : blogPosts.find((blogPost) => blogPost[property] === value);
}

// Schema ---------------------------------------------------------------------
// const blogSchema = {
//   category: {
//     in: ["body"],
//     isString: {
//       errorMessage: "Category is required",
//     },
//   },

//   title: {
//     in: ["body"],
//     isString: {
//       errorMessage: "Title is required",
//     },
//   },
// };

// export const checkBlogPostSchema = checkSchema(blogSchema);

// export const checkValidationResult = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     next(
//       createError(400, "Error during blog post validation", { message: errors })
//     );
//   } else {
//     next();
//   }
// };
