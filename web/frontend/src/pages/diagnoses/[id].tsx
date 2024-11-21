"use client";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { api } from "~/utils/api/api";
import { Reading } from "~/components/reading";
import { Loading } from "~/components/loading";
import { AuthContext } from "~/utils/context";
import { ProgressBar } from "~/components/progressBar";
import { BaseError } from "~/components/error";
import { ResponseCodes } from "~/utils/statis_codes";
import { Diagnosis, Voting } from "~/utils/api/types";
import { cookies } from "~/utils/cookies";

const ReadingPage = () => {
  const [error, setError] = useState<{
    state: boolean;
    statusCode: null | number;
    errorMessage: string;
  }>({
    state: false,
    statusCode: null,
    errorMessage: "Try restarting or it's probably not found",
  });

  const router = useRouter();
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [haveAlreadyVoted, setHaveAlreadyVoted] = useState(false);
  const [votingData, setVotingData] = useState<null | (Voting & { voters: { id: number; username: string }[] })>(null);

  useEffect(() => {
    if (!router.isReady || !router.query.id || Array.isArray(router.query.id)) {
      return;
    }
    setDiagnosisId(router.query.id);
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    const fetchData = (async () => {
      if (!diagnosisId) {
       console.log("No diagnoses id")
        return 
      }

      const token = cookies.token.get()

      try {
        const data = await api.diagnoses.getDiagnosis(diagnosisId);
        if (!data) {
          setError({
            state: true,
            statusCode: ResponseCodes.NOT_FOUND,
            errorMessage: "Not found",
          });
          return;
        }

        if ("errMsg" in data || !data.voting) {
          throw new Error("No voting available");
        }

        setDiagnosis(data);
        setHaveAlreadyVoted(data.voting.voters.some((voter) => voter.id === token?.userId));
        setVotingData(data.voting);
      } catch (err) {
        setError({
          state: true,
          statusCode: 500,
          errorMessage: "Something happened on the backend",
        });
      }
    })
    fetchData().then().catch((err) => { console.log(err);})
  }, [diagnosisId]);

  if (error.state) {
    return <BaseError message={error.errorMessage} />;
  }

  if (diagnosis === null || diagnosis === undefined) {
    return <Loading />;
  }

  async function vote(vote: boolean) {
    if (!diagnosisId || !cookies.token.get()) return;

    try {
      const res = await api.diagnoses.votings.vote(1, parseInt(diagnosisId), vote);
      if ("errMsg" in res) {
        console.log("Unsuccessful vote");
      } else {
        console.log("Successful vote");
        setHaveAlreadyVoted(true);
      }
    } catch (err) {
      console.error("Voting failed", err);
    }
  }

  return (
    <div className="h-screen bg-secondary">
      <Reading type={diagnosis.type} rawData={{}} prediction={diagnosis.prediction} />
      <div className="mt-8 rounded-lg border border-primary bg-primary p-4 shadow-md">
        <p className="text-lg font-semibold text-white">What do you say about this prediction?</p>
        <div className="mt-4 flex space-x-4">
          {typeof window !== "undefined" && !haveAlreadyVoted && (
            <>
              <button
                disabled={haveAlreadyVoted}
                className="hover:bg-primary-dark focus:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white focus:outline-none"
                onClick={async () => {
                 await vote(true) 
                }}
              >
                It is true
              </button>
              <button
                disabled={haveAlreadyVoted}
                className="hover:bg-secondary-dark focus:bg-secondary-dark rounded-md bg-secondary px-4 py-2 text-white focus:outline-none"
                onClick={async () => {
                 await vote(false) 
                }}
              >
                It is False
              </button>
            </>
          )}
        </div>
        {haveAlreadyVoted && <div className="mt-4 text-sm text-white">You have already voted</div>}
      </div>
      <div className="bg-secondary">
        <p className="text-white">Votes:</p>
        {votingData && (
          <ProgressBar fill={(votingData.yes / votingData.voters.length) * 100} />
        )}
      </div>
    </div>
  );
};

export default ReadingPage;

