import React from "react";
import styled, { css } from "styled-components";
import { layoutStyle, SpacingProps } from "../theme/utils";

type FontSize = "h100" | "h200" | "h300" | "h400" | "h500" | "h600" | "h700" | "h800";

interface TypeProps {
  $size: FontSize;
  $bold?: boolean;
  $semibold?: boolean;
  $light?: boolean;
  $italic?: boolean;
}

const sizeMap: Record<NonNullable<TypeProps["$size"]>, { fontSize: string; lineHeight: string }> = {
  h100: { fontSize: "0.8rem", lineHeight: "1.5" },
  h200: { fontSize: "1rem", lineHeight: "1.5" },
  h300: { fontSize: "1.2rem", lineHeight: "1.5" },
  h400: { fontSize: "1.44rem", lineHeight: "1.5" },
  h500: { fontSize: "1.7rem", lineHeight: "1.5" },
  h600: { fontSize: "2rem", lineHeight: "1.5" },
  h700: { fontSize: "2.5em", lineHeight: "1.5" },
  h800: { fontSize: "2.9rem", lineHeight: "1.5" },
};

const textStyle = css<TypeProps>`
  ${(props) =>
    sizeMap[props.$size] &&
    `
font-size: ${sizeMap[props.$size].fontSize};
line-height: ${sizeMap[props.$size].lineHeight};
`}
`;

interface TextProps extends React.HTMLAttributes<HTMLElement>, SpacingProps {
  size?: TypeProps["$size"];
  bold?: boolean;
  semibold?: boolean;
  light?: boolean;
  italic?: boolean;
}

const BaseText = ({
  defaultSize,
  displayName,
  element,
}: {
  defaultSize: TypeProps["$size"] | undefined;
  displayName: string;
  element?: any;
}) => {
  const TextComponent = ({ children, size, bold, semibold, light, italic, ...props }: TextProps) => (
    <StyledText
      $size={size ?? defaultSize}
      $bold={bold}
      $semibold={semibold}
      $light={light}
      $italic={italic}
      {...props}
      as={element}
    >
      {children}
    </StyledText>
  );
  TextComponent.displayName = displayName;
  return TextComponent;
};

const Text = BaseText({ defaultSize: "h200", displayName: "Text" });
const Inline = BaseText({ defaultSize: undefined, displayName: "Inline", element: "span" });
const H1 = BaseText({ defaultSize: "h800", displayName: "H1", element: "h1" });
const H2 = BaseText({ defaultSize: "h700", displayName: "H2", element: "h2" });
const H3 = BaseText({ defaultSize: "h600", displayName: "H3", element: "h3" });
const H4 = BaseText({ defaultSize: "h500", displayName: "H4", element: "h4" });
const H5 = BaseText({ defaultSize: "h400", displayName: "H5", element: "h5" });
const H6 = BaseText({ defaultSize: "h300", displayName: "H6", element: "h6" });

const StyledText = styled.p<TypeProps & SpacingProps>`
  ${textStyle}
  ${layoutStyle}
  ${(props) => props.$bold && "font-weight: 700;"}
  ${(props) => props.$semibold && "font-weight: 600;"}
  ${(props) => props.$light && "font-weight: 300;"}
  ${(props) => props.$italic && "font-style: italic;"}

  & code {
    background-color: #eaeaea;
    padding: 2px 4px;
    border-radius: 2px;
  }
`;

export const Type = {
  Text,
  Inline,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
};
