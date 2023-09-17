import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import gm from "gm";
import mongoose from "mongoose";
import { PDFDocument } from "pdf-lib";
import { getLanguage } from "./utils/utils.ts";
import store from "./services/oss.ts";
import { Book,BookAttrs } from "./models/books.ts";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be defined");
}

await mongoose.connect(process.env.MONGO_URI, {
  dbName: "library",
});
console.log("Connected to mongodb");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workDir = __dirname + "/" + process.argv[2];
const files = await fs.readdir(workDir);

for (const file of files) {
  const filePath = workDir + "/" + file;
  const fileBuffer = await fs.readFile(filePath);
  const pdf = await PDFDocument.load(fileBuffer);
  const title=pdf.getTitle()?pdf.getTitle() as string:file.substring(0,file.lastIndexOf("."))
  const date=pdf.getCreationDate()?.getFullYear()
  
//   const doc:BookAttrs={
//     title:pdf.getTitle()?pdf.getTitle() as string:file.substring(0,file.lastIndexOf(".")),
//     author:pdf.getAuthor(),
//     date:pdf.getCreationDate()?.getFullYear(),
//     language:getLanguage(pdf),
//   }
  gm(fileBuffer, "pdf[0]").write("./out.jpg", function (err) {
    if (err) return console.log(err);
    console.log("Created an image from a Buffer!");
  });
}


// const stat = await fs.stat(filePath);
// console.log(stat.size / 1024 / 1024);


