import React, { useEffect, useState } from "react";

export const PopUp: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-afc5c3 rounded p-4 shadow-md">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="bg-9fb5b3 text-f6fcfc mt-2 rounded px-4 py-2 hover:bg-opacity-80 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const SuccesfulPopUp: React.FC<{
  succesfulPart: string;
  timeBeforeExpiration: number;
}> = ({ succesfulPart, timeBeforeExpiration }) => {
  const [hasActiveTimeExpired, setHasActiveTimeExpired] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasActiveTimeExpired(true);
    }, timeBeforeExpiration);
    // Clear the timeout if the component is unmounted or the duration changes
    return () => clearTimeout(timer);
  }, [timeBeforeExpiration]);

  const handleClose = () => {
    setHasActiveTimeExpired(true);
  };

  if (hasActiveTimeExpired) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-f6fcfc rounded p-4 shadow-md">
        <PopUp
          message={"Successfully created " + succesfulPart}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};
