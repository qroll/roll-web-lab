import React, { useEffect, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import CheckboxCheckedIcon from "../icons/checkbox-checked-icon";
import CheckboxBlankIcon from "../icons/checkbox-blank-icon";
import CheckboxMixedIcon from "../icons/checkbox-mixed-icon";

const _Checkbox = (
  props: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean },
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const { checked, indeterminate, ...otherProps } = props;
  const elementRef = useRef<HTMLInputElement>();

  useImperativeHandle(ref, () => elementRef.current!!);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);

  return (
    <Container>
      <Input type="checkbox" ref={elementRef as any} checked={checked} {...otherProps} />
      <SelectionIndicator>
        {indeterminate ? <CheckboxMixedIcon /> : checked ? <CheckboxCheckedIcon /> : <CheckboxBlankIcon />}
      </SelectionIndicator>
    </Container>
  );
};

export const Checkbox = React.forwardRef(_Checkbox);

const Container = styled.div`
  position: relative;
  height: 1.5rem;
  width: 1.5rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  height: 100%;
  width: 100%;

  &:disabled {
    cursor: not-allowed;
  }
`;

const SelectionIndicator = styled.div`
  height: 100%;
  width: 100%;
  color: #3070c5;

  ${Input}:hover:checked + & {
    color: #204b83;
  }

  ${Input}:checked + & {
    color: #3070c5;
  }

  ${Input}:indeterminate + & {
    color: #3070c5;
  }

  ${Input}:disabled + & {
    color: #bcc4db;
  }
`;
