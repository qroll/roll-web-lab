import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Nullable } from "../common/types";

export type ComboboxWithKeyboardControlsItem = { id: number; label: string };

interface ComboboxWithKeyboardControlsProps {
  items: ComboboxWithKeyboardControlsItem[];
  label: string;
  onChange?: (value: Nullable<ComboboxWithKeyboardControlsItem>) => void;
  value?: Nullable<ComboboxWithKeyboardControlsItem>;
}

export function ComboboxWithKeyboardControls(props: ComboboxWithKeyboardControlsProps) {
  const { items, label, value, onChange } = props;

  const [selectedItem, setSelectedItem] = useState<Nullable<ComboboxWithKeyboardControlsItem>>(value);
  const [focusedItem, setFocusedItem] = useState<Nullable<ComboboxWithKeyboardControlsItem>>(value);
  const [expanded, setExpanded] = useState(false);
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLLIElement[]>([]);
  const ignoreHoverWhenNavigatingRef = useRef(false);

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  return (
    <div>
      <Label>{label}</Label>
      <div ref={comboboxWrapperRef}>
        <ComboboxSelection
          $expanded={expanded}
          readOnly
          value={selectedItem ? selectedItem.label : "---"}
          onFocus={() => {
            setExpanded(true);
          }}
          onBlur={(e) => {
            // checks if the next area of focus is on children of the main wrapper
            if (
              !e.nativeEvent.relatedTarget ||
              !comboboxWrapperRef.current?.contains(e.nativeEvent.relatedTarget as Node)
            ) {
              setExpanded(false);
            }
          }}
          onKeyDown={(e) => {
            switch (e.key) {
              case "ArrowDown": {
                if (!expanded) {
                  return;
                }
                ignoreHoverWhenNavigatingRef.current = true;
                // prevent page from scrolling too
                e.preventDefault();
                // navigate to next option
                const index = items.findIndex((item) => item === focusedItem);
                if (focusedItem) {
                  const nextIndex = Math.min(index + 1, items.length - 1);
                  setFocusedItem(items[nextIndex]);
                  itemRef.current[nextIndex].scrollIntoView();
                } else {
                  // pristine state, no item focused or selected yet
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
                // prevent page from scrolling too
                e.preventDefault();
                // navigate to previous option
                const index = items.findIndex((item) => item === focusedItem);
                if (focusedItem) {
                  const previousIndex = Math.max(index - 1, 0);
                  setFocusedItem(items[previousIndex]);
                  itemRef.current[previousIndex].scrollIntoView();
                } else {
                  // pristine state, no item focused or selected yet
                  setFocusedItem(items[items.length - 1]);
                  itemRef.current[items.length - 1].scrollIntoView();
                }
                break;
              }
              case "Enter":
              // spacebar key
              case " ": {
                e.preventDefault();
                // toggle the list visibility and select the current focused item
                if (expanded) {
                  setExpanded(false);
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
                break;
            }
          }}
        />
        <ComboboxListPositioning>
          <ComboboxList $expanded={expanded}>
            <ComboboxListItem
              // needed to get click event
              tabIndex={-1}
              $selected={!selectedItem}
              $focused={!focusedItem}
              onClick={() => {
                setExpanded(false);
                onChange?.(null);
              }}
              onMouseOver={() => {
                setFocusedItem(null);
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
                  key={id}
                  ref={(el) => (itemRef.current[index] = el!)}
                  tabIndex={-1}
                  $selected={selected}
                  $focused={focused}
                  onClick={() => {
                    setExpanded(false);
                    onChange?.(item);
                  }}
                  onMouseOver={() => {
                    // the mouse also sets a hover state, but to avoid confusion,
                    // we don't want to show that when user is navigating with the keyboard
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

const ComboboxSelection = styled.input<{ $expanded: boolean }>`
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
