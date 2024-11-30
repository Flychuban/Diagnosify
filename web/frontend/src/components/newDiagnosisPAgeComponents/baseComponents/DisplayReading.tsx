import React, { useEffect } from "react";
import JsonViewer from "./JsonViewer";

// Disclaimer:
/*
 * The code you will see won't be a good one since I was in a hurry, so I will provide some context.
 * Why so much logic in the component:
 * - For now, there are three types of diagnosis Reading:
 *   1. text data, text response
 *   2. image data, text response
 *   3. image data, image response
 * 
 * I check the type of reading and dump all the data into one of the three displayers.
 */

const TextDatatextResponse: React.FC<{
  data: { link_to_data_blob: string; prediction: string };
}> = ({ data }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Data fetched:", data);
    }, 2000);

    return () => clearInterval(interval); // Clean up the interval
  }, [data]);

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-primarytext">Data</h3>
      <div className="mb-4">
        <JsonViewer jsonUrl={data.link_to_data_blob} />
      </div>
      <p className="text-primarytext font-semibold">
        Prediction:{" "}
        {typeof data.prediction === "string"
          ? data.prediction
          : JSON.stringify(data.prediction)}
      </p>
    </div>
  );
};

function getStrategy(
  type: string
): React.FC<{ data: { link_to_data_blob: string; prediction: string } }> {
    if (type === "Diabetes" || type === "diabetes") {
        return TextDatatextResponse;
    }

    
}

export const DisplayReadingComponent: React.FC<{
  data: {
    id: number;
    type: string;
    userId: number;
    link_to_data_blob: string;
    link_to_prediction_info: string;
    is_correct: boolean | null;
  };
}> = ({ data }) => {
  const DisplayingStrategy = getStrategy(data.type);

  return (
    <div className="bg-primary p-8 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-primary-content text-primarytext">Reading Details</h2>
      <DisplayingStrategy
        data={{
          link_to_data_blob: data.link_to_data_blob,
          prediction: data.link_to_prediction_info,
        }}
      />
    </div>
  );
};

