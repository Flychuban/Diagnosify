import React from "react";

export const Error: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg">
        <p>{message}</p>
      </div>
    </div>
  );
};

export const DefaultError: React.FC = () => {
  return <Error message={"sheesh something happend, pls try again"} />;
};
