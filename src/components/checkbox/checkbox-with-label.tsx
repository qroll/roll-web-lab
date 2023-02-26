import React from "react";
import styled from "styled-components";
import { Checkbox } from "./checkbox";

export const CheckboxWithLabel = ({
  children,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { children?: React.ReactNode }) => {
  return (
    <CheckboxWrapper>
      <Checkbox {...props} />
      <CheckboxLabel htmlFor={props.id}>{children}</CheckboxLabel>
    </CheckboxWrapper>
  );
};

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const CheckboxLabel = styled.label`
  margin-left: 1rem;
  color: #333;
`;
