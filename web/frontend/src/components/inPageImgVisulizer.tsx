import React, { useState, useEffect } from "react";

const FileVisualizer: React.FC<{ file: File }> = ({ file }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);

  // Handle file change
  useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the result of FileReader as the image source
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }, [file]);

  if (!showImage) {
    return (
      <div>
        <button onClick={() => setShowImage(true)}>Show Image</button>
      </div>
    );
  }

  return (
    <div className="border-x-4 border-y-4 border-primary rounded-lg">
      <p className="text-center">File Visualization</p>
      {imagePreview && (
        <>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <button onClick={() => setShowImage(false)}>x</button>
        </>
      )}
    </div>
  );
};

export default FileVisualizer;

