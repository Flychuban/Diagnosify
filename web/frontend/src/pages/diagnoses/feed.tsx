import React, { useEffect, useState } from "react";
import { Api } from "~/utils/api";
import { cookies } from "~/utils/cookies";
import { Reading } from "~/components/reading";
import Link from "next/link";
const Feed: React.FC = () => {
  const [feed, setFeed] = useState<object[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await Api.getAllDiagnoses();
        console.log(data.data);
        setFeed(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFeed([]); // Set feed to empty array if error occurs
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {feed !== null ? (
        <>
          {feed.map((reading, index) => (
            <>
              <Reading
                key={index}
                rawData={reading.raw_data}
                type={reading.type}
                prediction={reading.prediction}
              />
              <Link href={"/diagnoses/" + reading.id}>Go to Diagnosis ID</Link>
            </>
          ))}
        </>
      ) : (
        "Loading"
      )}
    </>
  );
};

export default Feed;
