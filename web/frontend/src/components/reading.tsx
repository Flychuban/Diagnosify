import React from "react";
import { Diagnosis } from "~/utils/api/types";

export const Reading: React.FC<{
  rawData: object;
  type: string;
  prediction: boolean;
}> = ({ rawData, type, prediction }) => {
  return (
    <div className="rounded-lg border border-primary bg-primary p-4 text-white shadow-md">
      <p className="text-lg font-semibold text-white">Type: {type}</p>
      <div className="mt-4">
        {Object.keys(rawData).map((key) => {
          return (
            <div key={key} className="flex justify-between">
              <p className="text-sm text-white">{key}</p>
              <p className="text-sm font-semibold text-white">{rawData[key]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
