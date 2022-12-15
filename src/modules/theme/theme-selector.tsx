import React, { useCallback, useContext, useEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { LightTheme } from "./theme";

interface Theme {
  mode: "light" | "dark";
  theme: DefaultTheme;
  setPreferredTheme: (mode: "light" | "dark") => void;
}

const ThemeContext = React.createContext<Theme>({ mode: "light", theme: LightTheme, setPreferredTheme() {} });

export function ThemeSelector({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Theme["mode"]>(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const [preferred, setPreferred] = useState<Theme["mode"] | null>(null);

  useEffect(() => {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      setMode(event.matches ? "dark" : "light");
    });
  }, []);

  const setPreferredTheme = useCallback((mode: Theme["mode"]) => {
    setPreferred(mode);
  }, []);

  const currentMode = preferred ?? mode;
  const currentTheme = currentMode === "dark" ? LightTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ mode: currentMode, theme: currentTheme, setPreferredTheme }}>
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
