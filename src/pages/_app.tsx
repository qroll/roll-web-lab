import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeSelector } from "../modules/theme/theme-selector";
import Navbar from "../modules/navbar/navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeSelector>
      <Navbar />
      <Component {...pageProps} />
    </ThemeSelector>
  );
}

export default MyApp;
