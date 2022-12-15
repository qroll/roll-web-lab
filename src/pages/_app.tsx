import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeSelector } from "../modules/theme/theme-selector";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeSelector>
      <Component {...pageProps} />
    </ThemeSelector>
  );
}

export default MyApp;
