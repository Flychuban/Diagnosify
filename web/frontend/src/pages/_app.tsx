import "~/styles/globals.css";
import { AppProps } from "next/app";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthProvider, AuthContext } from "~/utils/context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
    </AuthProvider>
  );
}

const PageWrapper = ({ children }) => {
  // Accessing context using useContext
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const [contextLoaded, setContextLoaded] = useState(false);

  useEffect(() => {
    // Set contextLoaded to true once context is loaded
    if (token !== undefined) {
      setContextLoaded(true);
    }
  }, [token]);

  useEffect(() => {
    // Run the check only once the context has loaded
    if (contextLoaded) {
      console.log("drakeyyyyy", token);
      if (!router.pathname.includes("auth")) {
        if (token === null || token === undefined) {
          router.push("/auth/login");
        }
      }
    }
  }, [contextLoaded, token, router.pathname]);

  return <>{children}</>;
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default MyApp;
