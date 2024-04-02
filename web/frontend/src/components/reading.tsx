import React from "react";

export const Reading: React.FC<{ obj: object }> = ({ obj }) => {
  return (
    <div>
      {Object.keys(obj).map((key) => {
        return (
          <div key={key}>
            {key} : {obj[key]}
          </div>
        );
      })}
    </div>
  );
};
