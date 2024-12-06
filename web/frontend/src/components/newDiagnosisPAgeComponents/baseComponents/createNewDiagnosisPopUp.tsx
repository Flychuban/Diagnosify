import { useState } from "react";
import { ErrorPopUp, PopUpWrapper2 } from "~/components/popup";

export const CreateNewDiagnosisPopUp: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  saveDiagnosis: (vote: boolean, skipVoting: boolean | null) => Promise<void>;
}> = ({ isOpen, onClose, saveDiagnosis }) => {
  const [vote, setVote] = useState<null | boolean>(null);
  const [error, setError] = useState("");

  return (
    <PopUpWrapper2 isOpen={isOpen} onClose={onClose}>
      <div className="bg-secondary p-6 rounded-lg">
        <ErrorPopUp error={error} isOpen={error.length > 0} />
        <div className="mb-6">
          <p className="text-primaryText text-lg mb-4">What do you think about the diagnosis?</p>
          <button
            onClick={() => {
              setVote(true);
            }}
            type="button"
            className={`${vote === true ? "bg-red-500": "bg-primary"} text-white py-2 px-4 rounded-md mr-3 hover:bg-blue-700 focus:outline-none`}
          >
            It's true
          </button>
          <button
                      onClick={() => {
                          setVote(false);
                      }}
                      type="button"
                      className={`${vote === false ? "bg-red-500" : "bg-primary"} text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none`}
                      
          >
            It's false
          </button>
        </div>
        <div className="mb-4">
          <button
            onClick={async () => {
              if (vote === null) {
                setError("Please make a vote");
                return;
              }
                          await saveDiagnosis(vote, true);
                          onClose()
            }}
            type="button"
            className="bg-primary text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 focus:outline-none"
          >
            Direct vote without creating a vote
          </button>
        </div>
        <div>
          <button
            onClick={async () => {
              if (vote === null) {
                setError("Please make a vote");
                return;
              }
                          set
                          await saveDiagnosis(vote, null);
                          onClose()
            }}
            type="button"
            className="bg-primary text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 focus:outline-none"
          >
            Create reviewable diagnosis
          </button>
        </div>
      </div>
    </PopUpWrapper2>
  );
};
