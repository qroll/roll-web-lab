import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Nullable } from "../common/types";

export type SimpleComboboxItem = { id: number; label: string };

interface SimpleComboboxProps {
  items: SimpleComboboxItem[];
  label: string;
  onChange?: (value: SimpleComboboxItem | null) => void;
  value?: Nullable<SimpleComboboxItem>;
}

export function SimpleCombobox(props: SimpleComboboxProps) {
  const { items, label, value, onChange } = props;

  const [selectedItem, setSelectedItem] = useState<Nullable<SimpleComboboxItem>>(value);
  const [expanded, setExpanded] = useState(false);
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  useEffect(() => {
    // collapses the combobox
    function handleOutsideClick(e: MouseEvent) {
      // checks if the click was performed on children of the main wrapper
      if (e.target && !comboboxWrapperRef.current?.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    window.addEventListener("click", handleOutsideClick);
  }, [expanded]);

  return (
    <div>
      <Label>{label}</Label>
      <div ref={comboboxWrapperRef}>
        <ComboboxSelection
          $expanded={expanded}
          onClick={() => {
            setExpanded(!expanded);
          }}
          onBlur={(e) => {}}
        >
          {selectedItem?.label ?? "---"}
        </ComboboxSelection>
        <ComboboxListPositioning>
          <ComboboxList $expanded={expanded}>
            <ComboboxListItem
              $selected={!selectedItem}
              onClick={() => {
                setExpanded(false);
                onChange?.(null);
              }}
            >
              ---
            </ComboboxListItem>
            {items.map((item) => {
              const { id, label } = item;
              // using referential equality
              const selected = selectedItem === item;

              return (
                <ComboboxListItem
                  key={id}
                  $selected={selected}
                  onClick={() => {
                    setExpanded(false);
                    onChange?.(item);
                  }}
                >
                  {label}
                </ComboboxListItem>
              );
            })}
          </ComboboxList>
        </ComboboxListPositioning>
      </div>
    </div>
  );
}

const Label = styled.label`
  font-weight: bolder;
  display: block;
  margin: 0 0 1rem 0;
`;

const ComboboxSelection = styled.div<{ $expanded: boolean }>`
  background: #fff;
  border: 1px solid #888;
  border-radius: 3px;
  padding: 0.5rem 1rem;

  ${(props) => props.$expanded && "outline: #baf solid 1px;"}
`;

const ComboboxListPositioning = styled.div`
  position: relative;
  margin-top: 1px;
`;

const ComboboxList = styled.ul<{ $expanded: boolean }>`
  background-color: #fff;
  border: 1px solid #888;
  border-radius: 3px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  max-height: 200px;
  overflow: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  ${(props) => !props.$expanded && "display: none;"}
`;

const ComboboxListItem = styled.li<{ $selected: boolean }>`
  padding: 0.5rem 1rem;

  &:hover {
    background-color: #baf;
  }

  ${(props) =>
    props.$selected &&
    css`
      background-color: #fab;
      font-weight: bold;
    `}
`;
