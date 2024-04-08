import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { Api } from "~/utils/api";
import { Reading } from "~/components/reading";
import { Loading } from "~/components/loading";
import { AuthContext } from "~/utils/context";
import { ProgressBar } from "~/components/progressBar";
const ReadingPage = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState<object | null>(null);
  const [haveAlreadyVoted, setHaveAlreadyVoted] = useState(false);
  const [votingData, setVotingData] = useState<null | object>(null);
  useEffect(() => {
    async function fetchData() {
      if (router.query.id === undefined) {
        return;
      }
      const data = await Api.getReading(router.query.id);
      console.log(data.data);
      setDiagnosis(data.data);
      if (
        data.data.voting !== undefined &&
        data.data.voting !== null &&
        data.data.voting.voters.length > 0
      ) {
        setVotingData(data.data.voting);
      }
      setHaveAlreadyVoted(
        data.data.voting.voters.some((voter) => {
          return voter.id === token?.id;
        }),
      );
    }
    fetchData();
  }, [router.query.id, token]);

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
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
        <p className="text-lg font-semibold text-gray-800">
          What do you say about this prediction?
        </p>
        <div className="mt-4 flex space-x-4">
          {!haveAlreadyVoted && (
            <>
              <button
                disabled={haveAlreadyVoted}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
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
                It's true
              </button>
              <button
                disabled={haveAlreadyVoted}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
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
                False
              </button>
            </>
          )}
        </div>
        {haveAlreadyVoted && (
          <div className="mt-4 text-sm text-gray-600">
            You have already voted
          </div>
        )}
      </div>
      <div>
        Votes:
        {votingData !== undefined && votingData !== null && (
          <ProgressBar
            fill={(votingData.yes / votingData.voters.length) * 100}
          />
        )}
      </div>
    </div>
  );
};

export default ReadingPage;
