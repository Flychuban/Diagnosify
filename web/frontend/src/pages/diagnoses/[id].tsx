"use client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api/api";
import { Reading } from "~/components/reading";
import { Loading } from "~/components/loading";
import { BaseError } from "~/components/error";
import { ResponseCodes } from "~/utils/statis_codes";
import { Diagnosis, Voting } from "~/utils/api/types";
import { cookies } from "~/utils/cookies";
import { ChatComponent } from "~/components/Chat";
import { DisplayReadingComponent } from "~/components/newDiagnosisPAgeComponents/baseComponents/DisplayReading";
import { useExecuteRequest } from "~/hooks/requestHook";
import { useTraceUpdate } from "~/hooks/debug/checkPropCausingRerender";
import { ProgressBar } from "~/components/progressBar";
import axios from "axios";

// Voting component
const VotingSection: React.FC<{
  diagnosisId: string;
  votingId: number;
  haveAlreadyVoted: boolean;
  onVote: (voted: boolean) => void;
}> = ({ diagnosisId, votingId, haveAlreadyVoted, onVote }) => {
  const handleVote = async (vote: boolean) => {
    if (!diagnosisId || !cookies.token.get()) return;
    try {
      const res = await axios.post(`http://localhost:3003/diag/voting/${votingId}/vote`, {
        userId: cookies.token.get()?.userId,
        vote: vote
      }) 
      if ("errMsg" in res) {
        console.log("Unsuccessful vote");
      } else {
        console.log("Successful vote");
        onVote(true);
      }
    } catch (err) {
      console.error("Voting failed", err);
    }
  };

  return (
    <div className="mt-4 flex text-primarytext space-x-4">
      {!haveAlreadyVoted ? 
      <>
      <button
        className="hover:bg-primary-dark focus:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white focus:outline-none"
        onClick={() => handleVote(true)}
        disabled={haveAlreadyVoted}
      >
        It is true
      </button>
      <button
        className="hover:bg-secondary-dark focus:bg-secondary-dark rounded-md bg-secondary px-4 py-2 text-white focus:outline-none"
        onClick={() => handleVote(false)}
        disabled={haveAlreadyVoted}
      >
        It is False
        </button>
      </> : <div>ypu have already voted</div>}
    </div>
  );
};

const ReadingPage: React.FC = () => {
  const router = useRouter();
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [haveAlreadyVoted, setHaveAlreadyVoted] = useState(false);
  console.log("rerendering")
  React.useEffect(() => {
    if (!router.isReady || !router.query.id || Array.isArray(router.query.id)) {
      return;
    }
    console.log("running the useEffect")
    setDiagnosisId(router.query.id);
  }, [router.isReady, router.query.id]);

  const [diagnosis, isLoading, errorMsg] = useExecuteRequest<{diagnosis: Diagnosis & {prediction : boolean}} | null>(
    null,
    async () => {
      if (!diagnosisId) return null;
      const data = await api.diagnoses.getDiagnosis(diagnosisId);
      if (!data) throw new Error("Diagnosis not found");
      if ("errMsg" in data) throw new Error("No voting available");

      setHaveAlreadyVoted(
        data.diagnosis.voting.votes.some(
          (vote) => vote.user.id === cookies.token.get()?.userId
        )
      );
      return data;
    }
  );

  useTraceUpdate({diagnosisId})
  if (errorMsg) {
    return <BaseError message={errorMsg} />;
  }

  if (isLoading || !diagnosis) {
    return <Loading />;
  }

  function getVotingPercentage(votes) {
    if (votes.length === 0) return 0;
    const trueVotes = votes.filter((vote) => vote.vote.indexOf("false") > -1).length;
    return (trueVotes / votes.length) * 100;
  }

  return (
    <div className="h-screen bg-secondary">
      <Reading
        type={diagnosis.diagnosis.type}
        rawData={{}}
        prediction={diagnosis.diagnosis.prediction}
      />
      <DisplayReadingComponent data={diagnosis.diagnosis} />
      <div className="mt-8 rounded-lg border border-primary bg-primary p-4 shadow-md">
        <p className="text-lg font-semibold text-white">What do you say about this prediction?</p>
        {diagnosisId && (
          <VotingSection
            diagnosisId={diagnosisId}
            votingId={diagnosis.diagnosis.voting.id}
            haveAlreadyVoted={haveAlreadyVoted}
            onVote={() => setHaveAlreadyVoted(true)}
          />
        )}
      </div>

      <div className="bg-secondary">
        <p className="text-white">Votes:</p>
        <ProgressBar fill={getVotingPercentage(diagnosis.diagnosis.voting.votes)}/>
        {/* Add voting data visualization like a ProgressBar here */}
      </div>

      {diagnosisId && <ChatComponent diagnosisId={parseInt(diagnosisId)} />}
    </div>
  );
};

export default ReadingPage;

