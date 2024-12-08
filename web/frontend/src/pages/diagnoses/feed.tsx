// Feed.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Reading } from '~/components/reading';
import type { Diagnosis } from '~/utils/api/types';
import { api } from '~/utils/api/api';
import { useExecuteRequest } from '~/hooks/requestHook';
import axios from 'axios';
import { Env } from '~/utils/env';
import { User } from '~/types/apiTypes';
import { Dots } from '~/components/newDiagnosisPAgeComponents/baseComponents/createNewDiagnosisPopUp';
import { cookies } from '~/utils/cookies';

const Card: React.FC<{ diagnosis: Diagnosis }> = ({diagnosis }) => {
  const [userData, isLoading, isError] = useExecuteRequest(null, async () => {
    return await axios.get<{ user: User }>(`${Env.gateway_url}/diag/diag/user/getById/${diagnosis.id}`, {
      headers: {
        Authorization: `Bearer ${cookies.token.get()!.userId}`,
        authorization: `Bearer ${cookies.token.get()!.userId}`
      },
    })
  })
  if (isError) {
    return <div>{ isError }</div>
  }

  return <div>
    <div 
            className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 text-gray-100"
          >
            <div className="border-b border-zinc-700 p-4">
              <h2 className="text-xl font-medium text-white">
                {diagnosis.type} Prediction
              </h2>
            </div>
            
            <div className="p-6">
        Created by {isLoading && <div>  Loading  <Dots/></div>} {userData?.data.user.username} 
            </div>
            <div className=""> {diagnosis.is_correct === null ? "voting closed" : "voting open"}</div>
            <div className="border-t border-zinc-700 bg-zinc-800/50 p-4">
              <Link 
                href={`/diagnoses/${diagnosis.id}`}
                className="block w-full rounded-lg bg-red-500 px-4 py-2 text-center 
                         font-medium text-white transition-colors hover:bg-red-600 
                         focus:outline-none focus:ring-2 focus:ring-red-500 
                         focus:ring-offset-2 focus:ring-offset-zinc-800"
              >
                View Details
              </Link>
            </div>
          </div>
  </div>
}


const Feed: React.FC = () => {
  const [feed, setFeed] = useState<Diagnosis[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await api.diagnoses.getAllDiagnoses();
        if ("errMsg" in data) {
          setFeed(null);
        } else {
          console.log(data.diagnoses)
          setFeed(data.diagnoses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFeed(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
        <div className="flex items-center gap-2 text-gray-300">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
          <span className="text-lg font-medium">Loading diagnoses...</span>
        </div>
      </div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="mx-auto max-w-2xl rounded-lg bg-zinc-800 p-4 text-gray-300">
          <div className="flex items-center gap-2">
            <div className="text-lg">⚠️</div>
            <p>No diagnosis data available. Start by selecting a disease to predict.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {feed.map((reading, index) => (
          <Card diagnosis={reading} key={reading.id}/>
        ))}
      </div>
    </div>
  );
};

export default Feed;
