import React, { useEffect, useState } from "react";
import { Api } from "~/utils/api";
import { cookies } from "~/utils/cookies";
import { Reading } from "~/components/reading";
import Link from "next/link";

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<object[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Api.getAllDiagnoses();
        console.log(data.data);
        setFeed(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFeed([]);
        setLoading(false);
      }
    }
    fetchData();
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
                rawData={reading.raw_data}
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
