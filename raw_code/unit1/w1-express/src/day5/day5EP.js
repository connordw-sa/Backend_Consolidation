// Imports --------------------------------------------------------------------
import express from "express";
import multer from "multer";
import { extname } from "path";
import uniqid from "uniqid";

import {
  getProducts,
  writeProducts,
  writeProductPicture,
  deleteProduct,
  updateProduct,
  // checkProductSchema,
  // checkValidationResult,
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
    // checkProductSchema,
    // checkValidationResult,
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
    // checkProductSchema,
    // checkValidationResult,
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
  )
  .post("/products/:id/reviews", async (req, res, next) => {
    try {
      const products = await getProducts();
      const index = products.findIndex(
        (product) => product._id === req.params.id
      );
      if (index !== -1) {
        if (!products[index].reviews) {
          products[index].reviews = [];
        }
        if (req.body.rate > 5 || req.body.rate < 1) {
          res.status(400).send({ message: "Rate must be between 1 and 5" });
          return;
        }
        products[index].reviews.push({
          ...req.body,
          _id: uniqid(),
          createdAt: new Date(),
        });
        await writeProducts(products);
        res.status(201).send(products[index]);
      }
    } catch (error) {
      next(error);
    }
  })
  .get("/products/:id/reviews", async (req, res, next) => {
    try {
      const products = await getProducts();
      const product = products.find((product) => product._id === req.params.id);
      if (product) {
        res.send(product.reviews);
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    } catch (error) {
      next(error);
    }
  })
  .get("/products/:id/reviews/:reviewId", async (req, res, next) => {
    try {
      const products = await getProducts();
      const product = products.find((product) => product._id === req.params.id);
      if (product) {
        const review = product.reviews.find(
          (review) => review._id === req.params.reviewId
        );
        if (review) {
          res.send(review);
        } else {
          res.status(404).send({ message: "Review not found" });
        }
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    } catch (error) {
      next(error);
    }
  })
  .put("/products/:id/reviews/:reviewId", async (req, res, next) => {
    try {
      const products = await getProducts();
      const productIndex = products.findIndex(
        (product) => product._id === req.params.id
      );
      if (productIndex !== -1) {
        const reviewIndex = products[productIndex].reviews.findIndex(
          (review) => review._id === req.params.reviewId
        );
        if (reviewIndex !== -1) {
          products[productIndex].reviews[reviewIndex] = {
            ...products[productIndex].reviews[reviewIndex],
            ...req.body,
            updatedAt: new Date(),
          };
          await writeProducts(products);
          res.send(products[productIndex]);
        } else {
          res.status(404).send({ message: "Review not found" });
        }
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    } catch (error) {
      next(error);
    }
  })
  .delete("/products/:id/reviews/:reviewId", async (req, res, next) => {
    try {
      const products = await getProducts();
      const productIndex = products.findIndex(
        (product) => product._id === req.params.id
      );
      if (productIndex !== -1) {
        const reviewIndex = products[productIndex].reviews.findIndex(
          (review) => review._id === req.params.reviewId
        );
        if (reviewIndex !== -1) {
          products[productIndex].reviews.splice(reviewIndex, 1);
          await writeProducts(products);
          res.status(204).send();
        } else {
          res.status(404).send({ message: "Review not found" });
        }
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    } catch (error) {
      next(error);
    }
  });
