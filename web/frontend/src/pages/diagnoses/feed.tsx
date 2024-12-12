import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Reading } from '~/components/reading';
import { Diagnosis } from '~/utils/api/types';
import { api } from '~/utils/api/api';
import { useExecuteRequest } from '~/hooks/requestHook';
import axios from 'axios';
import { Env } from '~/utils/env';
import { User } from '~/types/apiTypes';
import { Dots } from '~/components/newDiagnosisPAgeComponents/baseComponents/createNewDiagnosisPopUp';
import { cookies } from '~/utils/cookies';
import { getBaseUrl } from '~/utils/getHost';
import { FeedFilter } from '~/components/FilterMenu';

const Card: React.FC<{ diagnosis: Diagnosis }> = ({ diagnosis }) => {
  const [userData, isLoading, isError] = useExecuteRequest(null, async () => {
    return await axios.get<{ user: User }>(`${Env.gateway_url}/diag/diag/user/getById/${diagnosis.userId}`, {
      headers: {
        Authorization: `Bearer ${cookies.token.get()!.userId}`,
        authorization: `Bearer ${cookies.token.get()!.userId}`
      },
    });
  });

  if (isError) {
    return <div>{isError}</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 text-gray-100">
      <div>Debug delete if you see this: {diagnosis.id}</div>
      <div className="border-b border-zinc-700 p-4">
        <h2 className="text-xl font-medium text-white">{diagnosis.type} Prediction</h2>
      </div>
      <div className="p-6 flex justify-around">
        <div>
          Created by {isLoading && <div>Loading <Dots /></div>} {userData?.data.user.username}
        </div>
        <div>{diagnosis.is_correct === null ? "voting closed" : "voting open"}</div>
      </div>
      {diagnosis.description !== null && <div>{ diagnosis.description }</div>}
      <div className="border-t border-zinc-700 bg-zinc-800/50 p-4">
        <Link
          href={`${getBaseUrl(window.location.href)}/diagnoses/${diagnosis.id}`}
          className="block w-full rounded-lg bg-red-500 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

async function getDiagnosisHotness(diagnosisId: number): Promise<number> {
  try {
    const res = await axios.post<{ count: number }>(`${getBaseUrl(window.location.href)}/api/getHotness`, { id: diagnosisId });
    return res.data.count;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

const Feed: React.FC = () => {
  const [page,setPage] = useState(1)
  const [feed, setFeed] = useState<Diagnosis[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentFilter, setFilter] = useState(0);
  const [diagnosesHotness, setDiagnosesHotness] = useState<null | (Diagnosis & { hotness: number })[]>(null);

  const baseFilter = useCallback((diagnoses: Diagnosis[], filter: (diagnoses: Diagnosis[]) => Diagnosis[]) => {
    const newDiagnoses = [...diagnoses]; // simpler deep copy
    const filtered = filter(newDiagnoses);
    return filtered;
  }, []);

  const filters = useCallback(() => [
    {
      name: "none",
      execute: (diagnoses: Diagnosis[]) => baseFilter(diagnoses, (diagnoses) => diagnoses),
    },
    {
      name: "hottest",
      execute: (diagnoses: Diagnosis[]) => {
        if (!diagnosesHotness) return diagnoses;
        return baseFilter(diagnoses, (diagnoses) => diagnosesHotness.sort((a, b) =>   b.hotness - a.hotness));
      },
    },
  ], [baseFilter, diagnosesHotness]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await api.diagnoses.getAllDiagnoses(page);
        if ("errMsg" in data) {
          setFeed([]);
        } else {
          setFeed(data.diagnoses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFeed([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnoses();
  }, [page]);

  useEffect(() => {
    const fetchHotness = async () => {
      if (!feed) return;
      try {
        const diagnosesWithHotness = await Promise.all(
          feed.map(async (diag) => ({
            ...diag,
            hotness: await getDiagnosisHotness(diag.id),
          }))
        );
        setDiagnosesHotness(diagnosesWithHotness);
      } catch (error) {
        console.error("Error fetching hotness data:", error);
        setDiagnosesHotness(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotness();
  }, [feed]);

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
  const paginationIndex = feed.length
  const currentFilters = filters();
  const filteredData = currentFilters[currentFilter]?.execute(feed.slice(0, paginationIndex)) ?? [];

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      {diagnosesHotness === null ? <div>fetching data for filter <Dots/></div>: <FeedFilter
        options={currentFilters.map((filter) => filter.name)}
        indexOfSelectedElement={currentFilter}
        setIndexOfSelectedElements={setFilter}
      />}
      <div className="mx-auto max-w-3xl space-y-4">
        {filteredData.map((reading) => (
          <Card diagnosis={reading} key={reading.id} />
        ))}
      </div>
      <div>
        <button onClick={() => setPage(1)}>{"<<"}</button>
        {[page - 2, page - 1, page, page + 1, page + 2].map((v, idx) => {
  if (v > 0) {
    return (
      <button
        key={idx}
        onClick={() => setPage(v)}
        className={`${
          v === page ? 'bg-primary text-primarytext' : 'bg-secondary text-primarytext'
        } p-2 rounded mx-1`}
      >
        {v}
      </button>
    );
  }
})}

      </div>
    </div>
  );
};

export default Feed;

