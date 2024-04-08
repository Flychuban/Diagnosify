import React from "react";
// ! A bit bad practice since its not actually a single component but i will use ut in the same way in multiple places so will leave it like this until it causes problems
export const Reading: React.FC<{
  rawData: object;
  type: string;
  prediction: boolean;
}> = ({ rawData, type, prediction }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <p className="text-lg font-semibold text-gray-800">Type: {type}</p>
      <div className="mt-4">
        {Object.keys(rawData).map((key) => {
          return (
            <div key={key} className="flex justify-between">
              <p className="text-sm text-gray-600">{key}</p>
              <p className="text-sm font-semibold text-gray-700">
                {rawData[key]}
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Predicted: {prediction ? "Yes" : "No"}
      </p>
    </div>
  );
};
