import React from "react";
import styled from "styled-components";

const _Checkbox = (props: React.InputHTMLAttributes<HTMLInputElement>, ref: React.ForwardedRef<HTMLInputElement>) => {
  const { checked, disabled, onChange, ...otherProps } = props;
  return (
    <Container>
      <Input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        ref={ref as any}
        {...otherProps}
      />
      <SelectionIndicator />
      <Border />
    </Container>
  );
};

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(_Checkbox);

const Container = styled.div`
  position: relative;
  height: 1.5rem;
  width: 1.5rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  opacity: 0;
  height: 100%;
  width: 100%;

  &:disabled {
    cursor: not-allowed;
  }
`;

const SelectionIndicator = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  height: 60%;
  width: 60%;
  border-radius: 3px;

  background: white;

  ${Input}:hover:checked + & {
    background: #204b83;
  }

  ${Input}:checked + & {
    background: #3070c5;
  }

  ${Input}:disabled:checked + & {
    background: #bcc4db;
  }
`;

const Border = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  height: 100%;
  width: 100%;
  border: 2px solid #3070c5;
  border-radius: 3px;

  ${Input}:hover + div + & {
    border-color: #183863;
  }

  ${Input}:disabled + div + & {
    border-color: #bcc4db;
  }

  ${Input}:focus + div + & {
    outline: 2px solid #bcc4db;
  }
`;
