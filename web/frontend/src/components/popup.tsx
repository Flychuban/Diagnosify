import React, { useEffect, useState } from "react";
export const PopUp: React.FC<{ message: string }> = ({ message }) => {
  const [isClosed, setIsClosed] = useState(false);
  if (isClosed) {
    return;
  }
  return (
    <div>
      <p>{message}</p>
      <button
        onClick={() => {
          setIsClosed(true);
        }}
      >
        Close
      </button>
    </div>
  );
};

export const SuccesfulPopUp: React.FC<{
  succesfulPart: string;
  timeBeforeExpiration: number;
}> = ({ succesfulPart: successfulPart, timeBeforeExpiration }) => {
  const [hasActiveTimeExpired, setHasActiveTimeExpired] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasActiveTimeExpired(true);
    }, timeBeforeExpiration);
    // Clear the timeout if the component is unmounted or the duration changes
    return () => clearTimeout(timer);
  });

  if (hasActiveTimeExpired) {
    return;
  }
  return (
    <div>
      <PopUp message={"Successfuly created " + successfulPart} />
    </div>
  );
};
