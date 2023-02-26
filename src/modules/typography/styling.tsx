import { Type } from "../../components/typography/type";
import { Table } from "./table";

export const TypographyStyling = () => {
  return (
    <>
      <Type.H2 my="s" size="h400" bold>
        Styling text
      </Type.H2>
      <Table
        headers={["style", "example"]}
        rows={["light", "semibold", "regular", "bold" as const].map((style) => ({
          style,
          example: <Type.P {...{ [style]: true }}>The quick brown fox jumps over the lazy dog</Type.P>,
        }))}
        keyExtractor={({ style }) => style}
      />
      <Type.P my="m">
        Use <code>Type.Inline</code> to style text inline. It inherits the parent font size by default, so you
        don&apos;t have to repeat the <code>size</code> prop. You can still opt to override the font size.
      </Type.P>
      <Type.P size="h300" ml="m">
        Lorem <Type.Inline italic>ipsum</Type.Inline> <Type.Inline semibold>dolor</Type.Inline>{" "}
        <Type.Inline bold size="h500">
          sit
        </Type.Inline>{" "}
        sit amet consectetur, adipisicing elit.
      </Type.P>
    </>
  );
};
