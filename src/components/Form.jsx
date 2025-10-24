import React, { useEffect } from "react";
import GetData from "./GetData";
import { useState } from "react";
const Form = () => {
  const [file, setFile] = useState(null);
  const [details, setDetails] = useState("");
  const [r2Accesskey, setr2Accesskey] = useState("");
  const [r2Secretkey, setr2Secretkey] = useState("");
  const [s3Clienturl, sets3Clienturl] = useState("");

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!r2Accesskey || !r2Secretkey || !s3Clienturl) {
      alert("Please provide all S3 credentials!");
      return;
    }
    if (!file) return;

    const res = await fetch("http://localhost:5050/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        details: details,
        r2Accesskey: r2Accesskey,
        r2Secretkey: r2Secretkey,
        s3Clienturl: s3Clienturl,
      }),
    });
    // console.log("response from upload to R2", await res.json());
    const { uploadUrl, key } = await res.json();
    console.log("Received signed URL:", uploadUrl);
    console.log("Key for uploaded file:", key);
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });
    console.log("response after uploading to signed URL", response);
    // const data = await response.json();
    // console.log("response from PUT request to signed URL", data);
    alert(`Uploaded! Key: ${key}`);
    // const response = await fetch(uploadUrl, {
    //   method: "PUT",
    //   body: file,
    //   // headers: {
    //   //   "Content-Type": file.type || "application/octet-stream",
    //   // },
    // });

    // if (!response.ok) {
    //   throw new Error(`Upload failed with status ${response.status}`);
    // }

    // console.log("✅ File uploaded successfully to R2!", response);
  };
  const handleR2Accesskey = (e) => {
    setr2Accesskey(e.target.value);
  };
  const handleR2Secretkey = (e) => {
    setr2Secretkey(e.target.value);
  };
  const handleS3Clienturl = (e) => {
    sets3Clienturl(e.target.value);
  };
  const handleDetailInput = (e) => {
    setDetails(e.target.value);
  };
  const handleConnect = async (e) => {
    e.preventDefault();
    // console.log("Access Key:", r2Accesskey);
    // console.log("Secret Key:", r2Secretkey);
    // console.log("S3 Client URL:", s3Clienturl);
    const res = await fetch("http://localhost:5050/api/get-connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        r2Accesskey: r2Accesskey,
        r2Secretkey: r2Secretkey,
        s3Clienturl: s3Clienturl,
      }),
    });
    const data = await res.json();

    alert(data.message);
  };
  // useEffect(() => {
  //   console.log("value in details text area", details);
  // });
  return (
    <div className="border-1 rounded-xl w-1/2 absolute top-15 z-40 bottom-4 opacity-80 flex flex-col justify-center gap-4">
      <div className=" flex flex-col my-0 mx-auto gap-3 ">
        <div className=" flex flex-col my-0 mx-auto gap-2 w-[100%] items-center">
          <span className="text-xl font-bold">CONNECT TO YOUR R2</span>
          <form
            action=""
            className=" flex w-[100%]  flex-col my-0 mx-auto gap-3"
          >
            <input
              type="text"
              placeholder="R2 Access key"
              onChange={handleR2Accesskey}
            />
            <input
              type="text"
              placeholder=" R2 Secret key"
              onChange={handleR2Secretkey}
            />
            <input
              type="text"
              placeholder=" S3 Client url"
              onChange={handleS3Clienturl}
            />

            <button type="submit" onClick={handleConnect}>
              connect
            </button>
          </form>
        </div>

        <input
          type="file"
          onChange={handleFileUpload}
          placeholder="choose a file..."
        />
        <textarea
          name=""
          id=""
          value={details}
          onChange={handleDetailInput}
        ></textarea>
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div className=" flex flex-col w-1/2 my-0 mx-auto">
        <GetData />
      </div>
    </div>
  );
};

export default Form;
// Configure R2 client
// const s3 = new S3Client({
//   region: "auto",
//   endpoint: process.env.S3_CLIENT_URL,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY,
//     secretAccessKey: process.env.R2_SECRET_KEY,
//   },
// });
