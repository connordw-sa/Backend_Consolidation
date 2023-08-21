import { checkSchema, validationResult } from 'express-validator';
import createError from 'http-errors';

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

export const checkBlogPostSchema = checkSchema(blogSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      createError(400, 'Error during blog post validation', { message: errors })
    );
  } else {
    next();
  }
};
