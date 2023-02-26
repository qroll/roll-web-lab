import localFont from "@next/font/local";
import type { AppProps } from "next/app";
import { ThemeSelector } from "../components/theme/theme-selector";
import "../styles/globals.css";

const font = localFont({ src: "../../assets/SourceSans3-VariableFont_wght.ttf", weight: "100 900" });

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeSelector>
      <style jsx global>{`
        :root {
          --font-base: ${font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </ThemeSelector>
  );
}

export default App;
