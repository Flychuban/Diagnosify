import React, { useState } from "react";
import axios from "axios";
import { useExecuteRequest } from "~/hooks/requestHook";
import { ComponentReliantOnRequestWrapper } from "~/components/universal_components/CompoentReliantOnARequestWrapper";
import { timelimitedProxy } from "~/singletons/requestSender";

const JsonViewer: React.FC<{ jsonUrl: string }> = ({ jsonUrl }) => {
    const [error, setError] = useState<string | null>(null);

    // Fetch data using useExecuteRequest hook
    const [jsonData, isLoading, errorMsg] = useExecuteRequest<{ dataForPrediction: object } | null>(
        null,
        async () => {
            try {
              // Fetch data through the proxy
              if (jsonData !== null) {
                return null
              }
                    const response = await axios.get<{ dataForPrediction: object }>(jsonUrl);
                    return response.data;
            } catch (err: any) {
                console.error("Error fetching JSON data:", err);
                setError(err.message || "An error occurred while fetching the data.");
                throw err;
            }
        }
    );

    return (
        <ComponentReliantOnRequestWrapper isLoading={isLoading} error={errorMsg}>
            <div className="max-w-3xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-center mb-4">JSON Viewer</h2>
                {error ? (
                    <div className="text-red-500 font-semibold text-center">{error}</div>
                ) : (
                    <textarea
                        className="w-full h-96 p-4 text-sm font-mono bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={jsonData ? JSON.stringify(jsonData, null, 2) : "Loading..."}
                        readOnly
                    />
                )}
            </div>
        </ComponentReliantOnRequestWrapper>
    );
};

export default JsonViewer;
