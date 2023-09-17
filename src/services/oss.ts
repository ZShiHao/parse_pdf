import OSS from "ali-oss";
import dotenv from "dotenv";

dotenv.config()

if (!process.env.OSS_ACCESS_KEY_ID) {
  throw new Error("OSS_ACCESS_KEY_ID is not found in env");
}
if (!process.env.OSS_ACCESS_KEY_SECRET) {
  throw new Error("OSS_ACCESS_KEY_SECRET is not found in env");
}
const store = new OSS({
  region: "oss-cn-hangzhou",
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: "online-library",
});

export default store;
