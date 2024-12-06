import React, { ReactNode, useEffect, useState } from "react";

export const PopUpWrapper2: React.FC<{ onClose: () => void, isOpen: boolean, children: ReactNode }> = ({ onClose, isOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-secondary rounded p-4 shadow-md border-primary border-x-4 border-y-4">
        {children}
        <button
          onClick={() => { onClose() }}
          className="bg-9fb5b3 text-f6fcfc mt-2 rounded px-4 py-2 hover:bg-opacity-80 focus:outline-none"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export const PopUpWrapper: React.FC<{ ComponentToDisplay: () => ReactNode, onClose: () => void, isOpen: boolean}> = ({ ComponentToDisplay, onClose, isOpen }) => {
  
  
  if (!isOpen) {
    return
  }
  
  
  return <div>
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div className="bg-secondary rounded p-4 shadow-md border-primary border-x-4 border-y-4">
        <ComponentToDisplay />
        <button
          onClick={onClose}
          className="bg-9fb5b3 text-f6fcfc mt-2 rounded px-4 py-2 hover:bg-opacity-80 focus:outline-none"
        >
         Close 
        </button>
      </div>
    </div>
  </div>
} 


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
    return <div></div>;
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




export const ErrorPopUp: React.FC<{ error: string, isOpen: boolean, onClose: () => void }> = ({ error, isOpen, onClose }) => { 
  return <PopUpWrapper2 onClose={() => { console.log("jijiijjijij"); onClose() }}  isOpen={isOpen} >
    <div className="bg-red-500">
    <div>Error happend</div>
    <div>{error}</div>
</div>
  </PopUpWrapper2>
}

export const SuccesfulActionPopUp: React.FC<{ text: string, onClose: () => void }> = ({ text, onClose }) => {
  return <PopUpWrapper2 onClose={() => { onClose() }} isOpen={text.length > 0}>
    <div>Succesfully {text }
  </div>
  </PopUpWrapper2>
}