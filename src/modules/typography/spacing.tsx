import { ReactNode } from "react";
import styled from "styled-components";
import { SpacingProps } from "../../components/theme/utils";
import { Type } from "../../components/typography/type";
import { Table } from "./table";

export const TypographySpacing = () => {
  return (
    <>
      <Type.H2 my="s" size="h400" bold>
        Specifying spacing
      </Type.H2>
      <Type.P my="m">Use props to set margin and paddings.</Type.P>
      <Table
        headers={["prop", "description"]}
        rows={[
          {
            prop: "m",
            description: "vertical and horizontal margins",
          },
          {
            prop: "mt",
            description: "top margin",
          },
          {
            prop: "mb",
            description: "bottom margin",
          },
          {
            prop: "ml",
            description: "left margin",
          },
          {
            prop: "mr",
            description: "right margin",
          },
          {
            prop: "mx",
            description: "vertical margins",
          },
          {
            prop: "my",
            description: "horizontal margins",
          },
        ].map(({ prop, description }) => ({
          key: prop,
          prop: (
            <Type.P>
              <code>{prop}</code>
            </Type.P>
          ),
          description,
        }))}
        keyExtractor={({ key }) => key}
      />
      <SpacingExample m="m" p="m">
        With margin and padding
      </SpacingExample>
      <SpacingExample mb="m" pt="m">
        With top margin and bottom padding
      </SpacingExample>
      <SpacingExample my="m">With vertical margin</SpacingExample>
      <SpacingExample mx="m">With horizontal margin</SpacingExample>
    </>
  );
};

const SpacingExample = ({ children, ...props }: { children: ReactNode } & SpacingProps) => {
  return (
    <SpaceWrapper>
      {children}
      <Space>
        <SpacedText {...props}>The quick brown fox jumps over the lazy dog</SpacedText>
      </Space>
    </SpaceWrapper>
  );
};

const SpacedText = styled(Type.P)`
  background-color: pink;
`;

const SpaceWrapper = styled.div`
  margin: 1rem 0;
`;

const Space = styled.div`
  border: 1px solid black;
  margin-top: 0.5rem;
`;
