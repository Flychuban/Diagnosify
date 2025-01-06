import { useState, useEffect } from "react";
import { AuthToken, cookies } from "~/utils/cookies";


export function useGetCookie<T>(
  functionToFetchCookie: () => Promise<T>,
  retryLimit  = 10, // Retry limit to prevent infinite retries
  interval = 5000 // Retry interval in ms
) {
  const [cookie, setCookie] = useState<T | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleGetCookie = async () => {
    try {
      const data = await functionToFetchCookie();
      setCookie(data);
    } catch (error) {
      console.error("Error occurred while loading cookie:", error);
      setRetryCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (retryCount >= retryLimit) {
      console.error("Retry limit reached. Stopping attempts to fetch cookie.");
      return;
    }

    const intervalId = setInterval(() => {
      handleGetCookie();
    }, interval);

    return () => clearInterval(intervalId); // Cleanup
  }, [retryCount, retryLimit, interval]);

  return cookie;
}

export const useGetAuthToken = (): AuthToken | null => {
  const cookie = useGetCookie<AuthToken>(() => {
    const cookie = cookies.token.get(); // Assuming this function exists
    if (cookie === null) {
      throw new Error("Cookie not found");
    }
    return Promise.resolve(cookie); // Return a resolved promise to match async signature
  });

  if (!cookie) {
    console.warn("Auth token cookie not found.");
    return null; // Gracefully handle the absence of a token
  }

  return cookie;
};
