import fs from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { getLanguage } from "./utils/utils.ts";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Book, BookAttrs } from "./models/books.ts";
import store from "./services/oss.ts";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

// await mongoose.connect(process.env.MONGO_URI, {
//   dbName: "library",
// });
console.log("Connected to mongodb");
async function upload(fileBuffer: Buffer, fileName: string) {
  const pdf = await PDFDocument.load(fileBuffer);

  const title = pdf.getTitle()
    ? (pdf.getTitle() as string)
    : fileName.substring(0, fileName.lastIndexOf("."));
  const date = pdf.getCreationDate()?.getFullYear();
  const author = pdf.getAuthor();
  const tags = [getLanguage(pdf)];
  const source = [
    {
      format: "PDF",
      size: (fileBuffer.length / 1024 / 1024).toFixed(2) + "MB",
      pages: pdf.getPageCount(),
      fileName: "几何书舍-" + fileName,
      location: "oss",
    },
  ];

  const doc: BookAttrs = {
    title,
    author,
    date,
    language: getLanguage(pdf),
    tags,
    source,
    cover: "几何书舍-" + fileName.replace(".pdf", ".jpg"),
  };

  console.log(doc);
  // gm(fileBuffer, "pdf[0]").write("./out.jpg", function (err) {
  //   if (err) return console.log(err);
  //   console.log("Created an image from a Buffer!");
  // });
}

export { upload };
