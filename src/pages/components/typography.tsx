import { ReactNode } from "react";
import styled from "styled-components";
import { SpacingProps } from "../../modules/theme/utils";
import { Type } from "../../modules/typography/type";

export default function TypographyPage() {
  const renderSizeTable = () => {
    return (
      <>
        <Type.H2 my="s" bold>
          Specifying size
        </Type.H2>
        <Table>
          <thead>
            <tr>
              <th>
                <Type.Text>size</Type.Text>
              </th>
              <th>
                <Type.Text>visual example</Type.Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {(["h100", "h200", "h300", "h400", "h500", "h600"] as const).map((size) => (
              <tr key={size}>
                <td>
                  <Type.Text>{size}</Type.Text>
                </td>
                <td>
                  <Type.Text size={size}>The quick brown fox jumps over the lazy dog</Type.Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  const renderStyling = () => {
    return (
      <>
        <Type.H2 my="s" bold>
          Styling text
        </Type.H2>
        <Table>
          <thead>
            <tr>
              <th>
                <Type.Text>style</Type.Text>
              </th>
              <th>
                <Type.Text>visual example</Type.Text>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Type.Text>light</Type.Text>
              </td>
              <td>
                <Type.Text light>The quick brown fox jumps over the lazy dog</Type.Text>
              </td>
            </tr>
            <tr>
              <td>
                <Type.Text>semibold</Type.Text>
              </td>
              <td>
                <Type.Text semibold>The quick brown fox jumps over the lazy dog</Type.Text>
              </td>
            </tr>
            <tr>
              <td>
                <Type.Text>bold</Type.Text>
              </td>
              <td>
                <Type.Text bold>The quick brown fox jumps over the lazy dog</Type.Text>
              </td>
            </tr>
          </tbody>
        </Table>
        <Type.Text my="m">
          Use <code>Text.Inline</code> to style text inline. It inherits the parent font size by default, so you
          don&apos;t have to repeat the <code>size</code> prop. You can still opt to override the font size.
        </Type.Text>
        <Type.Text size="h300" ml="m">
          Lorem <Type.Inline italic>ipsum</Type.Inline> <Type.Inline semibold>dolor</Type.Inline>{" "}
          <Type.Inline bold size="h500">
            sit
          </Type.Inline>{" "}
          sit amet consectetur, adipisicing elit.
        </Type.Text>
      </>
    );
  };

  const renderSpacing = () => {
    return (
      <>
        <Type.H2 my="s" bold>
          Specifying spacing
        </Type.H2>
        <Type.Text my="m">
          Use <code>m</code>, <code>m{`${"{t|r|b|l|x|y}"}`}</code> and <code>p</code>,{" "}
          <code>p{`${"{t|r|b|l|x|y}"}`}</code> props to set margin and paddings.
        </Type.Text>
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

  return (
    <Page>
      <Type.H1 bold>You must first invent the universe</Type.H1>
      {renderSizeTable()}
      {renderStyling()}
      {renderSpacing()}
    </Page>
  );
}

function SpacingExample({ children, ...props }: { children: ReactNode } & SpacingProps) {
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

const Table = styled.table`
  text-align: left;
  border-collapse: separate;
  border-spacing: 1rem;
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
