// Why 


import React, { useState } from "react";

const FileVisualizer: React.FC<{file: File}> = ({file}) =>  {
  const [imagePreview, setImagePreview] = useState(null);

  // Handle file change

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the result of FileReader as the image source
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file); // Read the file as a data URL
  };

  return (
    <div>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
    </div>
  );
}

export default FileVisualizer;
