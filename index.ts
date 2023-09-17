import { Command } from "commander";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseDate, parseTitle, parseAuthor, getInfo } from "./src/parse.ts";
import { multiUpload } from "./src/multiUpload.ts";
import { upload } from "./src/upload.ts";

const program = new Command();

program
  .command("parse")
  .option("-d, --date", "date")
  .option("-t --title")
  .option("-a --author")
  .action((opts, { args }) => {
    if (opts.date) parseDate(args);
    if (opts.title) parseTitle(args);
    if (opts.author) parseAuthor(args);
  });
program.command("info").action(getInfo);

program
  .command("upload")
  .option("-s --sole <path>")
  .option("-m --multi <dir>")
  .action(async (opts, { args }) => {
    console.log("opts", opts);
    console.log("args", args);

    if (opts.sole) {
      const fileBuffer = await fs.readFile(opts.sole);
      upload(fileBuffer,path.basename(opts.sole));
    }
    if (opts.multi) multiUpload(opts.multi);

    // const workDir = args.length
    //   ? args[0]
    //   : path.dirname(fileURLToPath(import.meta.url)) + "/books";
    // multiUpload(workDir);

    const filePath='/home/zhangshihao/pdfParser/books/神经衰弱和强迫观念的根治法 森田正马.pdf'
    const fileBuffer = await fs.readFile(filePath);
    upload(fileBuffer,path.basename(filePath))
  });

program.parse();
