import { useCallback, useEffect, useState } from "react";
import { set } from "zod";

export function useExecuteRequest<T>(refreshPeriod: number | null, funcToExecute: () => Promise<T>, statesToRerunRequestFetchingFor: string[] = []): [ data: T | null, isLoading: boolean, errorMsg: string | null] {
    const [state, setState] = useState<T | null>(null)
    const [errorMsg,setErrorMsg] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    
  const handleFuncToExecute = useCallback(() => {
  funcToExecute()
    .then((data) => {
      if ((data === null && state !== null) || (data === 0) || (JSON.stringify(data) === JSON.stringify(state))) {
      } else {
        setState(data);
        setErrorMsg(null);
        setIsLoading(false);
      }
    })
    .catch((error) => {
      console.log("error in execute request hook", error);
      setState(null);
      setIsLoading(false);
      setErrorMsg(error.message);
    });
  }, [funcToExecute,state,...statesToRerunRequestFetchingFor])

    useEffect(() => {
  let intervalId: NodeJS.Timeout | null = null;

  if (refreshPeriod) {
    intervalId = setInterval(() => {
      handleFuncToExecute();
    }, refreshPeriod);
  }

  handleFuncToExecute()

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    },[handleFuncToExecute, refreshPeriod])

    return [state, isLoading,errorMsg ]
}