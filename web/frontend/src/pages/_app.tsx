import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { AuthProvider } from "~/utils/context";
import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${inter.variable}`}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </main>
  );
};

export default MyApp;
