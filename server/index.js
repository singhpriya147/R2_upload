import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { MongoClient } from "mongodb";
import { writeFileSync } from "fs";

dotenv.config();
const app = express();

const uri = process.env.DB_URI;
const client = new MongoClient(uri);
await client.connect();
const db = client.db("myDatabase");
console.log("MongoDB connected");

app.use(
  cors({
    origin: "http://localhost:5173", // allow Vite dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

async function testConnection(s3) {
  try {
    const response = await s3.send(new ListBucketsCommand({}));
    console.log("Connected! Buckets:", response.Buckets);
  } catch (error) {
    console.error("Connection failed:", error);
  }
}
let s3 = null;
// testConnection();
app.post("/api/get-connect", async (req, res) => {
  try {
    const { r2Accesskey, r2Secretkey, s3Clienturl } = req.body;
    console.log("Access Key:", r2Accesskey);
    console.log("Secret Key:", r2Secretkey);
    console.log("S3 Client URL:", s3Clienturl);
    s3 = new S3Client({
      region: "auto",
      endpoint: s3Clienturl,
      credentials: {
        accessKeyId: r2Accesskey,
        secretAccessKey: r2Secretkey,
      },
    });
    // testConnection(s3);
    res.json({ message: "S3 Client configured successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to configure S3 client" });
  }
});

app.post("/api/upload-url", async (req, res) => {
  const { filename, contentType, details } = req.body;

  const uniqueKey = `uploads/${uuidv4()}-${filename}`;

  // const s3 = new S3Client({
  //   region: "auto",
  //   // endpoint: process.env.S3_CLIENT_URL,
  //   endpoint: s3Clienturl,
  //   credentials: {
  //     accessKeyId: r2Accesskey,
  //     secretAccessKey: r2Secretkey,
  //   },
  // });
  testConnection(s3);
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: uniqueKey,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  console.log("Generated signed URL:", signedUrl);
  // Store `uniqueKey` in your database here if needed
  const fileInfo = {
    filename: filename,
    key: uniqueKey,
    details: details,
  };
  await db.collection("veryImpData").insertOne(fileInfo);

  res.json({ uploadUrl: signedUrl, key: uniqueKey });
});

app.post("/api/getData", async (req, res) => {
  const { uuid, bucketName } = req.body;
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: uuid,
    ResponseContentDisposition: "attachment; filename=" + uuid.split("/").pop(),
  });

  const downloadSignedUrl = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });
  res.json({ downloadSignedUrl });
});

app.listen(5050, () => console.log("Backend running on http://localhost:5050"));
