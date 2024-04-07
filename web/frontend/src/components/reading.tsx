import React from "react";
// ! A bit bad practice since its not actually a single component but i will use ut in the same way in multiple places so will leave it like this until it causes problems
export const Reading: React.FC<{
  rawData: object;
  type: string;
  prediction: boolean;
}> = ({ rawData, type, prediction }) => {
  return (
    <div>
      <p>Type: {type}</p>
      {Object.keys(rawData).map((key) => {
        return (
          <div key={key}>
            {key} : {rawData[key]}
          </div>
        );
      })}
      <p>Predicted: {JSON.stringify(prediction)}</p>
    </div>
  );
};
