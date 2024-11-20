import React, { useEffect, useState } from "react";
import { api } from "~/utils/api/api";
import { cookies } from "~/utils/cookies";
import { Reading } from "~/components/reading";
import Link from "next/link";
import { Diagnosis } from "~/utils/api/types";

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<Diagnosis[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.diagnoses.getAllDiagnoses();
        console.log();
        if ("errMsg" in data) { 
        } else {
          setFeed(data.diagnoses);
          console.log("feed", feed);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFeed([]);
        setLoading(false);
      }
    })()
      .then(d => {
        console.log("finished fetching data")
      })
      .catch(error => { throw new Error("encountered error during data fetching:", error) })
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-secondary text-white">
      {loading ? (
        <p className="my-8 text-center text-lg font-semibold">Loading...</p>
      ) : feed !== null && feed !== undefined ? (
        feed.length > 0 ? (
          feed.map((reading, index) => (
            <div key={index} className="my-4 w-96 bg-primary">
              <Reading
                rawData={JSON.parse(reading.raw_data?.toString() || 
                `{"error":"data undefined"}`) }
                type={reading.type}
                prediction={reading.prediction}
              />
              <div className="flex items-center justify-center">
                <Link href={"/diagnoses/" + reading.id} className="text-center">
                  Go to Diagnosis
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="my-8 text-center text-lg font-semibold">
            No data available
          </p>
        )
      ) : (
        <p className="my-8 text-center text-lg font-semibold">
          No data available
        </p>
      )}
    </div>
  );
};

export default Feed;
