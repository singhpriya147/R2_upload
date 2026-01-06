import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

// connect DB
(async () => {
  await client.connect();
  console.log("MongoDB connected");
})();

const db = client.db("myDatabase");
console.log("MongoDB connected");

app.use(cors({ origin: "*" }));

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
  console.log("request body:", req.body);
  try {
    const { r2Accesskey, r2Secretkey, s3Clienturl } = req.body;

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

//STATIC BUID
app.use(express.static(path.join(__dirname, "client_build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client_build", "index.html"));
});
app.listen(5050, () => console.log("Backend running on http://localhost:5050"));
