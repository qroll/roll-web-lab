import "../styles/globals.css";
import localFont from "@next/font/local";
import type { AppProps } from "next/app";
import { ThemeSelector } from "../modules/theme/theme-selector";
import Navbar from "../modules/navbar/navbar";

const font = localFont({ src: "../../assets/SourceSans3-VariableFont_wght.ttf", weight: "100 900" });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeSelector>
      <Navbar />
      <style jsx global>{`
        :root {
          --font-base: ${font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </ThemeSelector>
  );
}

export default MyApp;
