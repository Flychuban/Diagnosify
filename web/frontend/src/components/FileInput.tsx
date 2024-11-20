import React from "react";

const FileInput: React.FC<{
  value: number | string | File | null,
  onChange: (value: File | null | number) => void
  callback: (value: number | string) => void
}> = ({ value, onChange, callback }) => {
    return (
      <input
        type="file"
        className="mx-3 w-32 border-2 border-gray-200 p-1 text-center"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0]);
          }
        }}
      />
    );
  };
export default FileInput;
