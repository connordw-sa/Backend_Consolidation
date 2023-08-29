// Imports --------------------------------------------------------------------
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import createError from "http-errors";
import { checkSchema, validationResult } from "express-validator";

// Variables ------------------------------------------------------------------

const { readJSON, writeJSON, writeFile } = fs;

//Products

const productsJSONPath = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "products.json"
);
const publicFolderProductsPath = join(process.cwd(), "./public/img/products");

import httpError from "http-errors";

// ...

export const getProducts = async (category, productId) => {
  const products = await readJSON(productsJSONPath);
  if (category) {
    const filteredProducts = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
    if (filteredProducts.length === 0) {
      throw httpError(404, { message: "No products found!" });
    }
    return filteredProducts;
  }
  if (productId) {
    const product = products.find((product) => product._id === productId);
    if (!product) {
      throw httpError(404, { message: "Product not found!" });
    }
    return product;
  }
  return products;
};

export const writeProducts = async (content) =>
  await writeJSON(productsJSONPath, content);

export const writeProductPicture = async (productId, fileName, content) => {
  const products = await getProducts();
  const index = products.findIndex((product) => product._id === productId);
  if (index !== -1) {
    products[index].imageUrl = `http://localhost:3001/img/products/${fileName}`;
    products[index].updatedAt = new Date();
    await writeFile(join(publicFolderProductsPath, fileName), content);
    await writeProducts(products);
  }
};

export const deleteProduct = async (productId) => {
  const products = await getProducts();
  const filteredProducts = products.filter(
    (product) => product._id !== productId
  );
  await writeProducts(filteredProducts);
};

export const updateProduct = async (productId, newProductData) => {
  const products = await getProducts();
  const index = products.findIndex((product) => product._id === productId);
  products[index] = {
    ...products[index],
    ...newProductData,
    updatedAt: new Date(),
  };
  await writeProducts(products);
};

// Schema ---------------------------------------------------------------------

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is required",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is required",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is required",
    },
  },
  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Price is required",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is required",
    },
  },
};

export const checkProductSchema = checkSchema(productSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(createError(400, "Error during validation", { message: errors }));
  } else {
    next();
  }
};
