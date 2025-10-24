import React, { useState } from "react";

const GetData = () => {
  const [uuid, setUuid] = useState(null);
  const [tempUuid, setTempUuid] = useState("");

  const handleInput = (e) => {
    setTempUuid(e.target.value);
  };
  const handleSearch = async () => {
    setUuid(tempUuid);
    const res = await fetch("http://localhost:5050/api/getData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid: tempUuid, bucketName: "myapp-data" }),
    });

    const { downloadSignedUrl } = await res.json();
    const response = await fetch(downloadSignedUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = tempUuid.split("/").pop(); // filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div title="This is a simple tooltip." className="flex flex-col gap-3">
      <input type="text" onChange={handleInput} />
      <button onClick={handleSearch}>Search by Id</button>

      {/* <span>{uuid}</span> */}
    </div>
  );
};

export default GetData;
