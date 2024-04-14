import React from "react";

const FileInput = ({ value, onChange, callback }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }

    return (
      <input
        type="file"
        className="mx-3 w-32 border-2 border-gray-200 p-1 text-center"
        onChange={handleFileChange}
      />
    );
  };
};
export default FileInput;
