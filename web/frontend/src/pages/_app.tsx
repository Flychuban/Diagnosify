import "~/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthProvider, AuthContext } from "~/utils/context";
import { cookies } from "~/utils/cookies";
import { Roboto } from 'next/font/google';
import '../styles/globals.css'; // Your global styles if any

const roboto = Roboto({
  subsets: ['latin'], // Define subsets as needed
  weight: ['400', '700'], // Optional: Specify weights
  variable: '--font-roboto', // CSS variable name
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => { 
    // Your custom app code here
    const token = cookies.token.get();
    console.log(token)
    if (token === undefined || token === null || token.hash === "") {
      console.log("missing token, redirecting ....")
      if (window.location.href.indexOf("/auth") > -1) {
        return
      }
      window.location.href = "/auth/login";
    }
  },[])
  return (
    <div className={`bg-black h-[100vh] ${roboto.className}`}>
          <Component {...pageProps} />
    </div>
  );
}
;
export default MyApp;
