import React, { useState } from "react";

export const BaseError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg">
        <p>{message}</p>
      </div>
    </div>
  );
};

export const DefaultError: React.FC = () => {
  return <BaseError message={"sheesh something happend, pls try again"} />;
};

export const DismissableError: React.FC<{ message: string }> = ({ message }) => {
  const [isOpen, setIsOpen ] = useState(true)

  if (!isOpen) { 
    return null;
  }

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg">
        <p>{message}</p>
        <button className="ml-2 text-sm font-medium text-white hover:text-red-400 focus:outline-none" onClick={() => {
          // document.body.removeChild(document.querySelector('.error-popup')); unsafe review it careffuly before refactoring to use it 
          setIsOpen(false)
        }}>
          Dismiss
        </button>
      </div>
    </div>
  )
}