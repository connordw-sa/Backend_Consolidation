// Imports --------------------------------------------------------------------
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

// Variables ------------------------------------------------------------------
const authorsJSONPath = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "authors.json"
);

export const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

export function writeFile(updatedAuthors) {
  fs.writeFileSync(authorsJSONPath, JSON.stringify(updatedAuthors));
}

export function findAuthorDetails(property, value, returnIndex = false) {
  return returnIndex
    ? authors.findIndex((author) => author[property] === value)
    : authors.find((author) => author[property] === value);
}
