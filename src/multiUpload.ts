import fs from "node:fs/promises";
import { upload } from "./upload.js";

async function multiUpload(workDir: string) {
  const files = await fs.readdir(workDir);

  for (const file of files) {
    const filePath = workDir + "/" + file;
    const fileBuffer = await fs.readFile(filePath);
    await upload(fileBuffer, file);
  }
}

export { multiUpload };
