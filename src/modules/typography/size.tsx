import { FontSize, Type } from "../../components/typography/type";
import { Table } from "./table";

const sizes: FontSize[] = ["h100", "h200", "h300", "h400", "h500", "h600", "h700", "h800" as const];

export const TypographySizes = () => {
  return (
    <>
      <Type.H2 my="s" size="h400" bold>
        Specifying size
      </Type.H2>
      <Table
        headers={["size", "example"]}
        rows={sizes.map((size) => ({
          size,
          example: <Type.Text size={size}>The quick brown fox jumps over the lazy dog</Type.Text>,
        }))}
        keyExtractor={({ size }) => size}
      />
    </>
  );
};
