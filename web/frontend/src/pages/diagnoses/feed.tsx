import React, { useEffect, useState } from "react";
import { Api } from "~/utils/api";
import { cookies } from "~/utils/cookies";
import { Reading } from "~/components/reading";
import Link from "next/link";

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<object[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Api.getAllDiagnoses();
        console.log(data.data);
        setFeed(data.data);
        setLoading(false); // Update loading state when data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setFeed([]); // Set feed to empty array if error occurs
        setLoading(false); // Update loading state when error occurs
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {loading ? ( // Render loading state while fetching data
        "Loading"
      ) : feed !== null && feed !== undefined ? (
        <>
          {feed.map((reading, index) => (
            <div key={index}>
              <Reading
                rawData={reading.raw_data}
                type={reading.type}
                prediction={reading.prediction}
              />
              <Link href={"/diagnoses/" + reading.id}>Go to Diagnosis ID</Link>
            </div>
          ))}
        </>
      ) : (
        "No data available"
      )}
    </>
  );
};

export default Feed;
