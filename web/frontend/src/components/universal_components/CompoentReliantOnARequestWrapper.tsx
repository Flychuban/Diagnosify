import { ReactNode } from "react"

export const ComponentReliantOnRequestWrapper: React.FC<{ isLoading: boolean, error: string | null, children: ReactNode }> = ({ isLoading, error, children }) => {
    
    if (isLoading) {
        return "Loading"
    }

    if (error) {
        return `Error: ${error}`
    }
    
    return (
        <div>{ children }</div>
    )
}