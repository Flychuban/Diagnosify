"use client";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api/api";
import { Reading } from "~/components/reading";
import { Loading } from "~/components/loading";
import { BaseError } from "~/components/error";
import { ResponseCodes } from "~/utils/statis_codes";
import { Diagnosis, Voting } from "~/utils/api/types";
import { cookies } from "~/utils/cookies";
import { ChatComponent } from "~/components/Chat";
import { ProgressBar } from "~/components/progressBar";
import { useGetAuthToken, useGetCookie } from "~/hooks/cookieGetter";
import { useExecuteRequest } from "~/hooks/requestHook";

interface ErrorState {
  state: boolean;
  statusCode: number | null;
  errorMessage: string;
}

// Custom hook to handle diagnosis fetching and state
const useDiagnosis = (diagnosisId: string | null) => {
  const [error, setError] = React.useState<ErrorState>({
    state: false,
    statusCode: null,
    errorMessage: "Try restarting or it's probably not found",
  });
  const [diagnosis, setDiagnosis] = React.useState<Diagnosis | null>(null);
  const [haveAlreadyVoted, setHaveAlreadyVoted] = React.useState(false);
  const [votingData, setVotingData] = React.useState<null | (Voting & { voters: { id: number; username: string }[] })>(null);

  React.useEffect(() => {
    const fetchDiagnosis = async () => {
      if (!diagnosisId) {
        console.log("No diagnosis id");
        return;
      }

      const token = cookies.token.get();

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

        if ("errMsg" in data) {
          throw new Error("No voting available");
        }

        setDiagnosis(data);
        setHaveAlreadyVoted(data.diagnosis.voting.votes.some((vote) => vote.user.id === token?.userId));
        setVotingData(data.diagnosis.voting);
      } catch (err) {
        console.error("Fetching diagnosis failed", err);
        setError({
          state: true,
          statusCode: 500,
          errorMessage: "Something happened on the backend",
        });
      }
    };

    fetchDiagnosis();
  }, [diagnosisId]);

  return { error, diagnosis, haveAlreadyVoted, votingData, setHaveAlreadyVoted };
};

// Voting component
const VotingSection: React.FC<{
  diagnosisId: string;
  haveAlreadyVoted: boolean;
  onVote: (voted: boolean) => void;
}> = ({ diagnosisId, haveAlreadyVoted, votingId,onVote }) => {

  const authToken = useGetAuthToken();
  const [votingInfo] = useExecuteRequest(null, async () => {
  }) 
  const handleVote = async (vote: boolean) => {
    if (!diagnosisId || !cookies.token.get()) return;
    try {
      const res = await api.diagnoses.votings.vote(votingId, parseInt(diagnosisId), vote);
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

  if (typeof window === "undefined" || haveAlreadyVoted) {
    return <div className="mt-4 text-sm text-white">You have already voted</div>;
  }

  return (
    <div className="mt-4 flex space-x-4">
      <button
        className="hover:bg-primary-dark focus:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white focus:outline-none"
        onClick={() => handleVote(true)}
      >
        It is true
      </button>
      <button
        className="hover:bg-secondary-dark focus:bg-secondary-dark rounded-md bg-secondary px-4 py-2 text-white focus:outline-none"
        onClick={() => handleVote(false)}
      >
        It is False
      </button>
    </div>
  );
};

const ReadingPage: React.FC = () => {
  const router = useRouter();
  const [diagnosisId, setDiagnosisId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!router.isReady || !router.query.id || Array.isArray(router.query.id)) {
      return;
    }
    setDiagnosisId(router.query.id);
  }, [router.isReady, router.query.id]);

  const { error, diagnosis, haveAlreadyVoted, votingData, setHaveAlreadyVoted } = useDiagnosis(diagnosisId);

  if (error.state) {
    return <BaseError message={error.errorMessage} />;
  }

  if (!diagnosis) {
    return <Loading />;
  }

  return (
    <div className="h-screen bg-secondary">
      <Reading type={diagnosis.type} rawData={{}} prediction={diagnosis.prediction} />
      
      <div className="mt-8 rounded-lg border border-primary bg-primary p-4 shadow-md">
        <p className="text-lg font-semibold text-white">What do you say about this prediction?</p>
        {diagnosisId && <VotingSection
          diagnosisId={diagnosisId}
          haveAlreadyVoted={haveAlreadyVoted}
          onVote={() => setHaveAlreadyVoted(true)}
        />}
      </div>

      <div className="bg-secondary">
        <p className="text-white">Votes:</p>
        {/* {votingData && votingData.voters.length > 0 ? (
          <ProgressBar fill={(votingData.yes / (votingData.no + votingData.yes)) * 100} />
        ) : (
          <p className="text-white">no votes yet</p>
        )} */}
      </div>

      {diagnosisId && <ChatComponent diagnosisId={parseInt(diagnosisId)} />}
    </div>
  );
};

export default ReadingPage;
