import { useEffect, useState } from "react";
import { set } from "zod";

export function useExecuteRequest<T>(refreshPeriod: number | null, funcToExecute: () => Promise<T>): [ data: T | null, isLoading: boolean, errorMsg: string | null] {
    const [state, setState] = useState<T | null>(null)
    const [errorMsg,setErrorMsg] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    
    const handleFuncToExecute = () => funcToExecute()
      .then((data) => {
        setState(data);
        setErrorMsg(null);
        setIsLoading(false);
      })
      .catch((error) => {
        setState(null);
        setIsLoading(false);
        setErrorMsg(error.message);
      })
        .finally(() => setState(null));
    
    
    useEffect(() => {
      
      if (refreshPeriod) {
            setInterval(() => {
                handleFuncToExecute().then().catch(e => {setErrorMsg(e.message)})
            }, refreshPeriod)
        }
      
      handleFuncToExecute().then().catch(error => {setErrorMsg(error.message)})
    })

    return [state, isLoading,errorMsg ]
}