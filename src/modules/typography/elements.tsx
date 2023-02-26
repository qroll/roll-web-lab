import styled from "styled-components";
import { Type } from "../../components/typography/type";

export const TypographyElements = () => {
  return (
    <>
      <Type.H2 my="s" size="h400" bold>
        Elements
      </Type.H2>
      {(["H1", "H2", "H3", "H4", "H5", "H6", "Text", "Inline"] as const).map((el) => (
        <Type.Text key={el}>
          <code>Type.{el}</code>
        </Type.Text>
      ))}
    </>
  );
};
