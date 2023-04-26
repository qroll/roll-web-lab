import { ReactNode } from "react";
import styled from "styled-components";
import { Type } from "../../components/typography/type";

interface TableProps<T extends Record<K, ReactNode>, K extends string> {
  headers: K[];
  rows: T[];
  keyExtractor: (row: T) => string;
}

export const Table = <T extends Record<K, ReactNode>, K extends string>({
  headers,
  rows,
  keyExtractor,
}: TableProps<T, K>) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              <Type.P semibold>{header}</Type.P>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={keyExtractor(row)}>
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

const StyledTable = styled.table`
  text-align: left;
  border-collapse: separate;
  border-spacing: 1rem;
`;
