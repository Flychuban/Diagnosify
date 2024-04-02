import React, { useEffect,useState } from "react"
import { Api } from "~/utils/api"
import { cookies } from "~/utils/cookies"


export default Feed: React.FC = () => {
    const [feeds,setFeeds] = useState<object[] | undefined>(undefined)
    useEffect(() => {
        async function fetchData() {
            const data = await Api.getAllDignoses() 
        }
    },[])
    return (
        <>
            {diagnoses.map((diagnose) => {
                return (    

                )
            })}
        </>
    )
}
