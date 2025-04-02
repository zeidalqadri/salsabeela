import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [gdriveUrl, setGdriveUrl] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else if (gdriveUrl) {
      formData.append("gdriveUrl", gdriveUrl);
    } else {
      alert("Please select a file or provide a Google Drive URL");
      return;
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const document = await response.json();
      console.log("Document uploaded and processed:", document);
    } else {
      console.error("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <div>
        <label>
          Upload from your computer:
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>
      <div>
        <label>
          Or paste a Google Drive link:
          <input
            type="text"
            placeholder="https://drive.google.com/..."
            value={gdriveUrl}
            onChange={(e) => setGdriveUrl(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
} 