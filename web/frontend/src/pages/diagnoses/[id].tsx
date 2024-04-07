import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { Api } from "~/utils/api";
import { Reading } from "~/components/reading";
import { Loading } from "~/components/loading";
import { AuthContext } from "~/utils/context";
const ReadingPage = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState<object | null>(null);
  useEffect(() => {
    async function fetch() {
      if (router.query.id === undefined) {
        return;
      }
      const data = await Api.getReading(router.query.id);
      setDiagnosis(data.data);
      console.log(data);
      console.log("KUR", token?.id);
    }
    fetch();
  }, [router.query.id]);

  if (diagnosis === null || diagnosis === undefined) {
    return <Loading />;
  }

  return (
    <div>
      <Reading
        type={diagnosis.type}
        rawData={diagnosis.raw_data}
        prediction={diagnosis.prediction}
      />
      <div>
        What you say about this precition?
        <button
          onClick={async () => {
            const res = await Api.VoteForDiagnosis(
              token?.id,
              router.query.id,
              true,
            );
            if (res.e) {
              console.log("unsuccessful vote");
            }
          }}
        >
          Its true{" "}
        </button>
        <button
          onClick={async () => {
            const res = await Api.VoteForDiagnosis(
              token?.id,
              router.query.id,
              false,
            );
            if (res.e) {
              console.log("unsuccessful vote");
            }
          }}
        >
          Falsey{" "}
        </button>
      </div>
    </div>
  );
};
export default ReadingPage;
