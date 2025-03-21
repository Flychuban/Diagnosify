'use client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { api } from '~/utils/api/api';
import { Reading } from '~/components/reading';
import { Loading } from '~/components/loading';
import { BaseError } from '~/components/error';
import { cookies } from '~/utils/cookies';
import { ChatComponent } from '~/components/Chat';
import { DisplayReadingComponent } from '~/components/newDiagnosisPAgeComponents/baseComponents/DisplayReading';
import { useExecuteRequest } from '~/hooks/requestHook';
import { useTraceUpdate } from '~/hooks/debug/checkPropCausingRerender';
import { ProgressBar } from '~/components/progressBar';
import { Button, Card, Divider, Space, Typography } from 'antd';
import axios from 'axios';

// Ant Design Imports
const { Title, Text } = Typography;
export function getVotingPercentage(votes) {
  if (votes.length === 0) return 0;
  const trueVotes = votes.filter(
    (vote) => vote.vote.indexOf('true') > -1,
  ).length;
  return (trueVotes / votes.length) * 100;
}

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
      const res = await api.votings.vote(votingId, cookies.token.get()?.userId, vote);
      if ('errMsg' in res) {
        console.log('Unsuccessful vote');
      } else {
        console.log('Successful vote');
        onVote(true);
      }
    } catch (err) {
      console.error('Voting failed', err);

    }
    window.location.href = window.location.href
  };

  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      {!haveAlreadyVoted ? (
        <Space size="large">
          <Button
            type="primary"
            className="hover:bg-green-600"
            onClick={() => handleVote(true)}
            disabled={haveAlreadyVoted}
          >
            It is True
          </Button>
          <Button
            danger
            className="hover:bg-red-600"
            onClick={() => handleVote(false)}
            disabled={haveAlreadyVoted}
          >
            It is False
          </Button>
        </Space>
      ) : (
        <Text type="warning">You have already voted</Text>
      )}
    </div>
  );
};

const ReadingPage: React.FC = () => {
  const router = useRouter();
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [haveAlreadyVoted, setHaveAlreadyVoted] = useState(false);
  const [toRerun, setRerunReq] = useState(1)
  
  function rerunReq() {
    setRerunReq(2)
  }

  React.useEffect(() => {
    if (!router.isReady || !router.query.id || Array.isArray(router.query.id)) {
      return;
    }
    setDiagnosisId(router.query.id);
  }, [router.isReady, router.query.id]);

  const [diagnosis, isLoading, errorMsg] = useExecuteRequest<{
    diagnosis: Diagnosis & { prediction: boolean };
  } | null>(null, async () => {
    if (!diagnosisId) return null;
    const data = await api.diagnoses.getDiagnosis(diagnosisId);
    if (!data) throw new Error('Diagnosis not found');
    if ('errMsg' in data) throw new Error('No voting available');

    setHaveAlreadyVoted(
      data.diagnosis.voting.votes.some(
        (vote) => vote.user.id === cookies.token.get()?.userId,
      ),
    );
    return data;
  }, [toRerun]);

  useTraceUpdate({ diagnosisId });

  if (errorMsg) {
    return <BaseError message={errorMsg} />;
  }

  if (isLoading || !diagnosis) {
    return <Loading />;
  }

  console.log('fnjknkew', diagnosis);

  return (
    <div className="min-h-screen bg-primary p-8">
      {/* Reading Section */}
      <Card
        className="mb-8 bg-secondary text-primarytext shadow-lg"
        bodyStyle={{ padding: '20px' }}
        title={
          <Title level={4}>
            <p className="text-primarytext">Reading Analysis</p>
          </Title>
        }
      >
        <Reading
          type={diagnosis.diagnosis.type}
          rawData={{}}
          prediction={diagnosis.diagnosis.prediction}
        />
        <Divider />
        <DisplayReadingComponent data={diagnosis.diagnosis} />
        <Divider />
        <div className="flex flex-auto items-center justify-center rounded-md bg-primary py-8">
          <div>
            <Title className="text-primarytext">
              <p className="text-primarytext">Description </p>
            </Title>
            <p>
              {diagnosis.diagnosis.description !== null &&
                diagnosis.diagnosis.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Voting Section */}
      <Card
        className="mb-8 bg-secondary text-primarytext shadow-lg"
        bodyStyle={{ padding: '20px' }}
        title={
          <p level={4} color="white" className="text-primarytext">
            Vote on This Prediction
          </p>
        }
      >
        <p color="white" className="text-primarytext">
          What do you think about this prediction?
        </p>
        {diagnosis.diagnosis.voting.is_closed === true && <div><Title><p className='text-primarytext text-center'>voting already closed</p></Title></div>}
        {diagnosisId && diagnosis.diagnosis.voting.is_closed === false && (
          <VotingSection
            diagnosisId={diagnosisId}
            votingId={diagnosis.diagnosis.voting.id}
            haveAlreadyVoted={haveAlreadyVoted}
            onVote={() => { setHaveAlreadyVoted(true); rerunReq()}}
          />
        )}
      </Card>

      {/* Progress Section */}
      <Card
        className="mb-8 bg-secondary text-white shadow-lg"
        bodyStyle={{ padding: '20px' }}
        title={<p className="text-primarytext">Vote Results</p>}
      >
        <ProgressBar
          fill={getVotingPercentage(diagnosis.diagnosis.voting.votes)}
        />
        <Text className="text-primarytext">
          Total Votes: {diagnosis.diagnosis.voting.votes.length}
        </Text>
      </Card>

      {/* Chat Section */}
      {diagnosisId && (
        <Card
          className="bg-secondary shadow-lg"
          bodyStyle={{ padding: '20px' }}
          title={
            <p level={4} color="white" className="text-primarytext">
              Discussion
            </p>
          }
        >
          <ChatComponent diagnosisId={parseInt(diagnosisId)} />
        </Card>
      )}
    </div>
  );
};

export default ReadingPage;
