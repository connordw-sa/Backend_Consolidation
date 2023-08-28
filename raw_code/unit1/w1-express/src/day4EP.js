/*
The backend should include the following routes:
use async await syntax
POST /authors/:id/uploadAvatar, uploads a picture (save as idOfTheAuthor.jpg in the public/img/authors folder) for the author specified by the id. Store the newly created URL into the corresponding author in authors.json
POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json
GET /blogPosts/:id/comments, get all the comments for a specific post
POST /blogPosts/:id/comments, add a new comment to the specific post
 // BE: Comments edit and delete
 Switch to async await syntax
 Configure Express to use the public folder to serve static files
*/
// Imports -------------------------------------------------------------------- 
import express from 'express';
import createError from 'http-errors';

import uniqid from 'uniqid';

