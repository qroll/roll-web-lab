import styled from "styled-components";
import CheckboxBlankIcon from "../icons/checkbox-blank-icon";
import CheckboxCheckedIcon from "../icons/checkbox-checked-icon";
import { Type } from "../typography/type";

interface ChecklistProps {
  items: {
    checked: boolean;
    label: string;
    remark?: string;
  }[];
}

export function Checklist(props: ChecklistProps) {
  const { items } = props;

  return (
    <Table>
      <thead>
        <tr>
          <th>
            <Type.Text></Type.Text>
          </th>
          <th>
            <Type.Text>property</Type.Text>
          </th>
          <th>
            <Type.Text>remarks</Type.Text>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={item.label}>
            <td>{item.checked ? <CheckedIcon /> : <UncheckedIcon />}</td>
            <td>
              <Type.Text>{item.label}</Type.Text>
            </td>
            <td>
              <Type.Text>{item.remark}</Type.Text>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const Table = styled.table`
  text-align: left;
  border-collapse: separate;
  border-spacing: 0.5rem;
  color: #000;
`;

const CheckedIcon = styled(CheckboxCheckedIcon)`
  width: 1.5rem;
  height: 1.5rem;
`;

const UncheckedIcon = styled(CheckboxBlankIcon)`
  width: 1.5rem;
  height: 1.5rem;
`;
