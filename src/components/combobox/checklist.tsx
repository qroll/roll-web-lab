import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import CheckboxBlankIcon from "../icons/checkbox-blank-icon";
import CheckboxCheckedIcon from "../icons/checkbox-checked-icon";
import { Type } from "../typography/type";

interface ChecklistProps {
  items: {
    checked: boolean;
    label: string;
    mandatory?: boolean;
    remark?: string;
  }[];
}

export function Checklist(props: ChecklistProps) {
  const { items } = props;

  return (
    <List>
      {items.map((item, i) => (
        <ListItem key={item.label}>
          <div>{item.checked ? <CheckedIcon /> : <UncheckedIcon />}</div>
          <div>
            <Type.P mb="xs">
              <ReactMarkdown
                components={{
                  p: React.Fragment,
                }}
              >
                {item.label}
              </ReactMarkdown>
              {item.mandatory && <Required aria-label="required">*</Required>}
            </Type.P>
            <Type.Text size="h100">{item.remark && <ReactMarkdown>{item.remark}</ReactMarkdown>}</Type.Text>
          </div>
        </ListItem>
      ))}
    </List>
  );
}

const List = styled.ul`
  text-align: left;
  color: #000;
`;

const ListItem = styled.li`
  display: flex;
  margin-bottom: 0.75rem;
`;

const CheckedIcon = styled(CheckboxCheckedIcon)`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
`;

const UncheckedIcon = styled(CheckboxBlankIcon)`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
`;

const Required = styled(Type.Inline)`
  color: red;
  margin-left: 0.25rem;
`;
