import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import {
    getLanguage,
    standardizeFileName,
  } from "./utils/utils.ts";

//解析出版日期
async function parseDate(args: any) {
    const workDir = args.length
      ? args[0]
      : path.dirname(fileURLToPath(import.meta.url)) + "/books";
    const files = await fs.readdir(workDir);
  
    for (const file of files) {
      const filePath = workDir + "/" + file;
      console.log(filePath);
  
      let fileBuffer: Buffer | null;
      let pdf: PDFDocument;
      let date: Date | undefined;
  
      try {
        fileBuffer = await fs.readFile(filePath);
        pdf = await PDFDocument.load(fileBuffer);
      } catch (error) {
        continue;
      }
  
      try {
        date = pdf.getCreationDate();
        if (!(date instanceof Date)) {
          new Error("日期格式错误");
        }
      } catch (error) {
        console.log(file, ": 请输入该本书的出版日期");
        await new Promise((resolve) => {
          process.stdin.on("data", async (data) => {
            const date = new Date(data.toString().trim());
            pdf.setCreationDate(date);
            const new_file_buffer = await pdf.save();
            await fs.writeFile(filePath, new_file_buffer);
            new_file_buffer != null;
            process.stdin.pause();
            resolve(null);
          });
        });
      }
      fileBuffer != null;
    }
    console.log("出版日期解析完成");
  }
  
  
  //解析作者
  async function parseAuthor(args: any) {
    const workDir = args.length
      ? args[0]
      : path.dirname(fileURLToPath(import.meta.url)) + "/books";
    const files = await fs.readdir(workDir);
  
    for (const file of files) {
      const filePath = workDir + "/" + file;
      let fileBuffer: Buffer | null;
      let pdf: PDFDocument;
      let author: string | undefined;
  
      try {
        console.log('解析: ',file)
        fileBuffer = await fs.readFile(filePath);
        pdf = await PDFDocument.load(fileBuffer);
      } catch (error) {
        continue;
      }
  
      try {
        author = pdf.getAuthor();
        if (!author) {
          new Error("没有作者");
        }
      } catch (error) {
        console.log(file, ": 请输入该本书的作者");
        await new Promise((resolve) => {
          process.stdin.on("data", async (data) => {
            pdf.setAuthor(data.toString());
            const new_file_buffer = await pdf.save();
            await fs.writeFile(filePath, new_file_buffer);
            new_file_buffer != null;
            process.stdin.pause();
            resolve(null);
          });
        });
      }
      fileBuffer != null;
    }
    console.log("作者解析完成");
  }
  
  //解析书名和文件名
  async function parseTitle(args: any) {
    const workDir = args.length
      ? args[0]
      : path.dirname(fileURLToPath(import.meta.url)) + "/books";
    const files = await fs.readdir(workDir);
  
    for (const file of files) {
      const new_file_name = standardizeFileName(file);
      let filePath = workDir + "/" + file;
      await fs.rename(filePath, workDir + "/" + new_file_name);
      const new_file_path = workDir + "/" + new_file_name;
  
      let fileBuffer: Buffer | null;
      let pdf: PDFDocument;
      let title: string | undefined;
  
      try {
        console.log('解析: ',new_file_name)
        fileBuffer = await fs.readFile(new_file_path);
        pdf = await PDFDocument.load(fileBuffer);
      } catch (error) {
        continue;
      }
  
      try {
        title = pdf.getTitle();
        pdf.setTitle(new_file_name.substring(0, new_file_name.lastIndexOf(".")));
        const new_file_buffer = await pdf.save();
        await fs.writeFile(new_file_path, new_file_buffer);
        new_file_buffer != null;
      } catch (error) {
        pdf.setTitle(new_file_name.substring(0, new_file_name.lastIndexOf(".")));
        const new_file_buffer = await pdf.save();
        await fs.writeFile(new_file_path, new_file_buffer);
        new_file_buffer != null;
      }
      fileBuffer != null;
    }
    console.log("标题文件名解析完成");
  }

  async function getInfo(opts: any, { args }: any) {
    console.log("opts", opts);
    const workDir = args.length
      ? args[0]
      : path.dirname(fileURLToPath(import.meta.url)) + "/books";
    const files = await fs.readdir(workDir);
    const filePath = workDir + "/" + files[1];
    console.log(filePath);
  
    const fileBuffer = await fs.readFile(filePath);
    const stat = await fs.stat(filePath);
    console.log((stat.size / 1024 / 1024).toFixed(2) + "MB");
  
    const pdf = await PDFDocument.load(fileBuffer);
  
    console.log(getLanguage(pdf));
    console.log(pdf.getTitle());
  
    console.log(pdf.getAuthor());
    console.log(pdf.getProducer());
    console.log(pdf.getCreator());
  
    try {
      console.log(pdf.getCreationDate()?.getFullYear());
    } catch (e) {
      await new Promise((resolve, reject) => {
        process.stdin.on("data", async (data) => {
          const date = new Date(data.toString().trim());
          if (date instanceof Date) {
            pdf.setCreationDate(date);
            const new_file_buffer = await pdf.save();
            await fs.writeFile(filePath, new_file_buffer);
            process.stdin.pause();
            resolve(null);
          } else {
            console.log("请输入正确的日期格式");
            reject(null);
          }
        });
      });
    }
  
    console.log("1231312");
  }

  export {
    parseAuthor,
    parseDate,
    parseTitle,
    getInfo
  }