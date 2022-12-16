import { ReactNode } from "react";
import styled from "styled-components";
import { SpacingProps } from "../../modules/theme/utils";
import { Type } from "../../modules/typography/type";

export default function TypographyPage() {
  return (
    <Page>
      <h1>You must first invent the universe</h1>
      <br />
      <h2>Specifying size</h2>
      <br />
      {(["h100", "h200", "h300", "h400", "h500", "h600"] as const).map((size) => (
        <Type.Text key={size} size={size}>
          The quick brown fox jumps over the lazy dog
        </Type.Text>
      ))}
      <br />
      <h2>Styling text</h2>
      <br />
      <Type.Text>
        Lorem ipsum&nbsp;
        <Type.Inline italic>
          dolor<Type.Inline bold>&nbsp;sit amet</Type.Inline>&nbsp;consectetur, adipisicing elit.
        </Type.Inline>
      </Type.Text>
      <br />
      <h2>Specifying spacing</h2>
      <br />
      <Spacing m="m" p="m">
        With margin and padding
      </Spacing>
      <Spacing mb="m" pt="m">
        With top margin and bottom padding
      </Spacing>
      <Spacing my="m">With vertical margin</Spacing>
      <Spacing mx="m">With horizontal margin</Spacing>
    </Page>
  );
}

function Spacing({ children, ...props }: { children: ReactNode } & SpacingProps) {
  return (
    <SpaceWrapper>
      {children}
      <Space>
        <SpacedText {...props}>The quick brown fox jumps over the lazy dog</SpacedText>
      </Space>
    </SpaceWrapper>
  );
}

const Page = styled.main`
  margin: 1rem auto;
  max-width: calc(1080px - 2rem);
`;

const SpacedText = styled(Type.Text)`
  background-color: pink;
`;

const SpaceWrapper = styled.div`
  margin: 1rem 0;
`;

const Space = styled.div`
  border: 1px solid black;
  margin-top: 0.5rem;
`;
