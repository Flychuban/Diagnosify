import "~/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cookies } from "~/utils/cookies";
import { Roboto } from "next/font/google";
import EventEmitter from "events";

// Create a global event emitter instance
export const globalEventEmitter = new EventEmitter();

export const Loading = () => {
  const [dotIndex, setDotIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev % 3) + 1); // Cycle through 1 to 3 dots
    }, 500);
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <div className="fixed inset-0 bg-blue-500 flex items-center justify-center" style={{ height: "90%" }}>
      <p className="text-white text-xl font-bold">
        {".".repeat(dotIndex)}
      </p>
    </div>
  );
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [shouldGlobalLoadingShow, setShouldGlobalLoadingShow] = useState();

  useEffect(() => {
    // Listen to the global event for loading state changes
    const handleLoadingEvent = (state: boolean) => {
      setShouldGlobalLoadingShow(state);
    };

    globalEventEmitter.on("setLoading", handleLoadingEvent);

    // Cleanup listener on unmount
    return () => {
      globalEventEmitter.off("setLoading", handleLoadingEvent);
    };
  }, []);

  useEffect(() => {
    const token = cookies.token.get();
    console.log(token);

    if (!token || !token.hash) {
      console.log("Missing token, redirecting...");
      if (!router.pathname.startsWith("/auth")) {
        router.push("/auth/login");
      }
    }
  }, [router]);

  return (
    <div className={`bg-black h-[100vh] ${roboto.className} font-bold relative`}>
      {shouldGlobalLoadingShow && <Loading />}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

