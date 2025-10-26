// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";
// dotenv.config();
// const uri=process.env.DB_URI
// async function seed() {
//   const client = new MongoClient(uri);
//   await client.connect();
//   const db = client.db("myDatabase");

//   const fakeUsers = Array.from({ length: 10 }).map((_, i) => ({
//     name: `SeedUser-${i}`,
//     email: `seed${i}@example.com`,
//     createdAt: new Date()
//   }));

//   await db.collection("users").insertMany(fakeUsers);
//   console.log("Inserted seed data!");
//   await client.close();
// }

// seed();

// export const downloadFilesFromBucket = async ({ bucketName }) => {
//   const { Contents } = await s3Client.send(
//     new ListObjectsCommand({ Bucket: bucketName }),
//   );
//   const path = await prompter.input({
//     message: "Enter destination path for files:",
//   });

//   for (const content of Contents) {
//     const obj = await s3Client.send(
//       new GetObjectCommand({ Bucket: bucketName, Key: content.Key }),
//     );
//     writeFileSync(
//       `${path}/${content.Key}`,
//       await obj.Body.transformToByteArray(),
//     );
//   }
//   console.log("Files downloaded successfully.\n");
// };
