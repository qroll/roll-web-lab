import { css } from "styled-components";

export type SpacingValues = "xs" | "s" | "m" | "l" | "auto";

export interface SpacingProps {
  m?: SpacingValues;
  mt?: SpacingValues;
  mr?: SpacingValues;
  mb?: SpacingValues;
  ml?: SpacingValues;
  mx?: SpacingValues;
  my?: SpacingValues;
  p?: SpacingValues;
  pt?: SpacingValues;
  pr?: SpacingValues;
  pb?: SpacingValues;
  pl?: SpacingValues;
  px?: SpacingValues;
  py?: SpacingValues;
}

const spaceMap: Record<SpacingValues, string> = {
  xs: "0.25rem",
  s: "0.5rem",
  m: "1rem",
  l: "2rem",
  auto: "auto",
};

export const layoutStyle = css<SpacingProps>`
  ${(props) => props.m && `margin: ${spaceMap[props.m]};`}
  ${(props) => props.mt && `margin-top: ${spaceMap[props.mt]};`}
${(props) => props.mr && `margin-right: ${spaceMap[props.mr]};`}
${(props) => props.mb && `margin-bottom: ${spaceMap[props.mb]};`}
${(props) => props.ml && `margin-left: ${spaceMap[props.ml]};`}
${(props) => props.my && `margin-top: ${spaceMap[props.my]}; margin-bottom: ${spaceMap[props.my]};`}
${(props) => props.mx && `margin-left: ${spaceMap[props.mx]}; margin-right: ${spaceMap[props.mx]};`}
${(props) => props.p && `padding: ${spaceMap[props.p]};`}
${(props) => props.pt && `padding-top: ${spaceMap[props.pt]};`}
${(props) => props.pr && `padding-right: ${spaceMap[props.pr]};`}
${(props) => props.pb && `padding-bottom: ${spaceMap[props.pb]};`}
${(props) => props.pl && `padding-left: ${spaceMap[props.pl]};`}
${(props) => props.py && `padding-top: ${spaceMap[props.py]}; padding-bottom: ${spaceMap[props.py]};`}
${(props) => props.px && `padding-left: ${spaceMap[props.px]}; padding-right: ${spaceMap[props.px]};`}
`;
