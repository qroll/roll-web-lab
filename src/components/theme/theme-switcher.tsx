import React from "react";
import styled, { css } from "styled-components";
import DarkModeIcon from "./dark-mode-icon";
import LightModeIcon from "./light-mode-icon";
import { useTheme } from "./theme-selector";

export function ThemeSwitcher() {
  const { mode, setPreferredTheme } = useTheme();
  const otherMode = mode === "dark" ? "light" : "dark";

  const onToggle = () => {
    setPreferredTheme(otherMode);
  };

  return (
    <Button $mode={mode} onClick={onToggle} aria-label={`Switch to ${otherMode} mode`}>
      <IconContainer>
        <DarkIcon $enabled={mode === "dark"} />
        <LightIcon $enabled={mode === "light"} />
      </IconContainer>
    </Button>
  );
}

const Button = styled.button<{ $mode: "dark" | "light" }>`
  box-sizing: content-box;
  margin: 0 1rem;
  padding: 0.5rem;
  height: 1.25rem;
  width: 1.25rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  color: white;

  transition: background 0.3s ease;

  &:hover {
    background: rgba(100, 100, 100, 0.25);
  }

  &:focus {
    outline: 1px solid #fff;
  }
`;

const IconContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const iconStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  height: 100%;
  width: 100%;
`;

const flipIcon = css<{ $enabled: boolean }>`
  transition: all 0.5s linear;
  transform: rotateY(-180deg);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  ${(props) => (props.$enabled ? "transform: rotateY(0);" : "visibility: hidden;")}
`;

const DarkIcon = styled(DarkModeIcon)<{ $enabled: boolean }>`
  ${iconStyle}
  ${flipIcon}
`;

const LightIcon = styled(LightModeIcon)<{ $enabled: boolean }>`
  ${iconStyle}
  ${flipIcon}
`;
