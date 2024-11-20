import "~/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthProvider, AuthContext } from "~/utils/context";
import { cookies } from "~/utils/cookies";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => { 
    // Your custom app code here
    const token = cookies.token.get();
    console.log(token)
    if (token === undefined || token === null || token === "") {
      if (window.location.href.indexOf("/auth") > -1) {
        return
      }
      window.location.href = "/auth/login";
    }
  },[])
  return (
    <div className="bg-primary">
          <Component {...pageProps} />
    </div>
  );
}
;
export default MyApp;
