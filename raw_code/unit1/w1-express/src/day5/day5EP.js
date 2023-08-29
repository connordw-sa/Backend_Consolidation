// ENDPOINTS

// POST  Review /products/:productId/reviews

// For both Products and Reviews, the field createdAt should be set when adding the current product/review to the list. (server side)
// The updatedAt should be equal to createdAt on creation and then change for each and every PUT on that very item.  (server side)
// Remember to validate everything that comes from the FE
// Test all the endpoints, also edge cases, and handle errors properly

// Extras
// GET list of  Reviews /products/:productId/reviews/
// GET single Review /products/:productId/reviews/:reviewId
// PUT  update Review /products/:productId/reviews/:reviewId
// DELETE  Review /products/:productId/reviews/:reviewId
// Filter by a category, GET /products?category=horror => should return only products belonging to the specified category

// Imports --------------------------------------------------------------------
import express from "express";
import multer from "multer";
import { extname } from "path";
import httpError from "http-errors";
import uniqid from "uniqid";
import {
  getProducts,
  writeProducts,
  writeProductPicture,
  deleteProduct,
  updateProduct,
  getReviews,
  writeReviews,
  updateReview,
  deleteReview,
  checkProductSchema,
  checkReviewSchema,
  checkValidationResult,
} from "./day5lib.js";

// Routes ---------------------------------------------------------------------
const dayFiveRouter = express.Router();

export default dayFiveRouter
  .get("/products", async (req, res, next) => {
    try {
      const products = await getProducts(req.query.category, req.query.id);
      res.send(products);
    } catch (error) {
      next(error);
    }
  })
  .post(
    "/products",
    checkProductSchema,
    checkValidationResult,
    async (req, res, next) => {
      try {
        const products = await getProducts();
        const newProduct = {
          ...req.body,
          _id: uniqid(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        products.push(newProduct);
        await writeProducts(products);
        res.status(201).send(newProduct);
      } catch (error) {
        next(error);
      }
    }
  )
  .put(
    "/products/:id",
    checkProductSchema,
    checkValidationResult,
    async (req, res, next) => {
      try {
        await updateProduct(req.params.id, req.body);
        res.send("Updated!");
      } catch (error) {
        next(error);
      }
    }
  )
  .delete("/products/:id", async (req, res, next) => {
    try {
      await deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  })
  .post(
    "/products/:id/upload",
    multer().single("productPicture"),
    async (req, res, next) => {
      try {
        const fileExt = extname(req.file.originalname);
        const fileName = req.params.id + fileExt;
        await writeProductPicture(req.params.id, fileName, req.file.buffer);
        res.send({ message: "Product picture uploaded successfully" });
      } catch (error) {
        next(error);
      }
    }
  );
