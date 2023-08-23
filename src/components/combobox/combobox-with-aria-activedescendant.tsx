import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Nullable } from "../common/types";

export type ComboboxWithAriaActivedescendantItem = { id: number; label: string };

interface ComboboxWithAriaActivedescendantProps {
  items: ComboboxWithAriaActivedescendantItem[];
  label: string;
  onChange?: (value: Nullable<ComboboxWithAriaActivedescendantItem>) => void;
  value?: Nullable<ComboboxWithAriaActivedescendantItem>;
}

export function ComboboxWithAriaActivedescendant(props: ComboboxWithAriaActivedescendantProps) {
  const { items, label, value, onChange } = props;

  const [selectedItem, setSelectedItem] = useState<Nullable<ComboboxWithAriaActivedescendantItem>>(value);
  const [focusedItem, setFocusedItem] = useState<Nullable<ComboboxWithAriaActivedescendantItem>>(value);
  const [expanded, setExpanded] = useState(false);
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);
  const comboboSelectionRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLLIElement[]>([]);
  const nonItemRef = useRef<HTMLLIElement>(null);
  const ignoreHoverWhenNavigatingRef = useRef(false);

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  return (
    <div>
      <Label htmlFor="dropdown-input">{label}</Label>
      <div ref={comboboxWrapperRef}>
        <ComboboxSelection
          role="combobox"
          aria-activedescendant={expanded ? `dropdown-listitem-${focusedItem ? focusedItem.id : "none"}` : undefined}
          aria-controls="dropdown-listitem-popup"
          aria-expanded={expanded}
          id="dropdown-input"
          ref={comboboSelectionRef}
          tabIndex={0}
          $expanded={expanded}
          onBlur={(e) => {
            if (
              !e.nativeEvent.relatedTarget ||
              !comboboxWrapperRef.current?.contains(e.nativeEvent.relatedTarget as Node)
            ) {
              setExpanded(false);
            }
          }}
          onClick={() => {
            if (expanded) {
              setExpanded(false);
              comboboSelectionRef.current?.focus();
            } else {
              setExpanded(true);
              if (focusedItem) {
                const index = items.findIndex((item) => item === focusedItem);
                itemRef.current[index].scrollIntoView();
              } else {
                nonItemRef.current?.scrollIntoView();
              }
            }
          }}
          onKeyDown={(e) => {
            switch (e.key) {
              case "ArrowDown": {
                if (!expanded) {
                  return;
                }
                ignoreHoverWhenNavigatingRef.current = true;
                e.preventDefault();
                const index = items.findIndex((item) => item === focusedItem);
                if (focusedItem) {
                  const nextIndex = Math.min(index + 1, items.length - 1);
                  setFocusedItem(items[nextIndex]);
                  itemRef.current[nextIndex].scrollIntoView();
                } else {
                  setFocusedItem(items[0]);
                  itemRef.current[0].scrollIntoView();
                }
                break;
              }
              case "ArrowUp": {
                if (!expanded) {
                  return;
                }
                ignoreHoverWhenNavigatingRef.current = true;
                e.preventDefault();
                const index = items.findIndex((item) => item === focusedItem);
                if (focusedItem) {
                  const previousIndex = Math.max(index - 1, 0);
                  setFocusedItem(items[previousIndex]);
                  itemRef.current[previousIndex].scrollIntoView();
                } else {
                  setFocusedItem(items[items.length - 1]);
                  itemRef.current[items.length - 1].scrollIntoView();
                }
                break;
              }
              case "Enter":
              // spacebar
              case " ": {
                e.preventDefault();
                if (expanded) {
                  setExpanded(false);
                  comboboSelectionRef.current?.focus();
                  onChange?.(focusedItem);
                } else {
                  setExpanded(true);
                }
                break;
              }
              case "Escape":
                if (!expanded) {
                  return;
                }
                e.preventDefault();
                setExpanded(false);
                comboboSelectionRef.current?.focus();
                break;
            }
          }}
        >
          {selectedItem ? selectedItem.label : "---"}
        </ComboboxSelection>
        <ComboboxListPositioning>
          <ComboboxList $expanded={expanded} role="listbox" id="dropdown-listitem-popup">
            <ComboboxListItem
              ref={nonItemRef}
              id={`dropdown-listitem-none`}
              role="option"
              aria-selected={!selectedItem}
              $selected={!selectedItem}
              $focused={!focusedItem}
              onClick={() => {
                setExpanded(false);
                comboboSelectionRef.current?.focus();
                onChange?.(null);
              }}
              onMouseOver={() => {
                setFocusedItem(null);
                nonItemRef.current?.scrollIntoView();
              }}
            >
              ---
            </ComboboxListItem>
            {items.map((item, index) => {
              const { id, label } = item;
              // using referential equality
              const selected = selectedItem === item;
              const focused = focusedItem === item;

              return (
                <ComboboxListItem
                  id={`dropdown-listitem-${id}`}
                  tabIndex={-1}
                  role="option"
                  key={id}
                  ref={(el) => (itemRef.current[index] = el!)}
                  aria-selected={selected}
                  $selected={selected}
                  $focused={focused}
                  onClick={() => {
                    setExpanded(false);
                    comboboSelectionRef.current?.focus();
                    onChange?.(item);
                  }}
                  onMouseOver={() => {
                    if (ignoreHoverWhenNavigatingRef.current) {
                      ignoreHoverWhenNavigatingRef.current = false;
                      return;
                    }
                    setFocusedItem(item);
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
  outline: none;
  color: #000;

  &:focus {
    outline: #baf solid 1px;
  }

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

const ComboboxListItem = styled.li<{ $selected: boolean; $focused: boolean }>`
  padding: 0.5rem 1rem;

  ${(props) =>
    props.$selected &&
    css`
      background-color: #fab;
      font-weight: bold;
    `}

  ${(props) =>
    props.$focused &&
    css`
      background-color: #baf;
    `}
`;
