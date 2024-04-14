import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    // Your upload logic here
  };

  return (
    <div>
      <h1>Upload PNG File</h1>
      <input type="file" accept="image/png" onChange={handleFileChange} />
      {imageUrl && (
        <div>
          <h2>Uploaded Image Preview:</h2>
          <img
            src={imageUrl}
            alt="Uploaded Image"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
