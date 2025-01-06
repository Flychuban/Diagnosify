import React from "react";
import { Progress } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are loaded

export const ProgressBar: React.FC<{ fill: number}> = ({ fill }) => {
  const fillB = 100 - fill; // Remaining percentage for the other side

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Title */}
      <h3 className="text-center text-lg font-semibold">Vote Distribution</h3>

      {/* Progress Bar */}
      <div className="h-8 w-full flex items-center relative bg-gray-200 rounded-full overflow-hidden shadow-md">
        {/* Side A */}
        <div
          className="h-full bg-blue-500 flex items-center justify-center text-white"
          style={{ width: `${fill}%`, transition: "width 0.3s ease" }}
        >
          {fill > 5 && (
            <span className="text-sm font-medium">Yes {fill.toString().slice(0,5)}%</span>
          )}
        </div>

        {/* Side B */}
        <div
          className="h-full bg-red-500 flex items-center justify-center text-white"
          style={{ width: `${fillB}%`, transition: "width 0.3s ease" }}
        >
          {fillB > 5 && (
            <span className="text-sm font-medium">No {fillB.toString().slice(0,5)}%</span>
          )}
        </div>
      </div>
    </div>
  );
};
