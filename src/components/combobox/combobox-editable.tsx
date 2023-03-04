import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Nullable } from "../common/types";

export type ComboboxEditableItem = { id: number; label: string };

interface ComboboxEditableProps {
  items: ComboboxEditableItem[];
  label: string;
  onChange?: (value: Nullable<ComboboxEditableItem>) => void;
  value?: Nullable<ComboboxEditableItem>;
}

export function ComboboxEditable(props: ComboboxEditableProps) {
  const { items, label, value, onChange } = props;

  const [input, setInput] = useState("");
  const [selectedItem, setSelectedItem] = useState<Nullable<ComboboxEditableItem>>(value);
  const [focusedItem, setFocusedItem] = useState<Nullable<ComboboxEditableItem>>(value);
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);
  const comboboxInputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLLIElement[]>([]);
  const selectedItemRef = useRef(selectedItem); // for access in event listener
  const active = expanded || focused;
  const filteredItems = useMemo(() => {
    if (!input) {
      return items;
    }
    return items.filter((item) => item.label.includes(input));
  }, [input, items]);

  useEffect(() => {
    selectedItemRef.current = selectedItem;
  }, [selectedItem]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!comboboxWrapperRef.current?.contains(e.target as Node)) {
        handleWidgetBlur();
      }
    };

    if (active) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [active]);

  useEffect(() => {
    setSelectedItem(value);
    setInput(value?.label || "");
  }, [value]);

  useEffect(() => {
    if (expanded && focusedItem) {
      const index = filteredItems.findIndex((item) => item === focusedItem);
      itemRef.current[index]?.scrollIntoView();
    }
  }, [expanded, focusedItem, filteredItems]);

  const handleWidgetFocus = () => {
    comboboxInputRef.current?.select();
    setExpanded(true);
    setFocused(true);
  };

  const handleWidgetBlur = () => {
    setInput(selectedItemRef.current?.label || "");
    setExpanded(false);
    setFocused(false);
  };

  const expandPopup = () => {
    setExpanded(true);
    if (!focusedItem) {
      setFocusedItem(selectedItem || filteredItems[0]);
    }
  };

  const collapsePopupWithSelection = () => {
    setExpanded(false);
    onChange?.(focusedItem);
  };

  const collapsePopupWithoutSelection = () => {
    setInput(selectedItem?.label || "");
    setExpanded(false);
  };

  const selectItem = (item: ComboboxEditableItem) => {
    setExpanded(false);
    onChange?.(item);
    comboboxInputRef.current?.focus();
  };

  const focusNextItemInPopup = () => {
    const index = filteredItems.findIndex((item) => item === focusedItem);
    if (focusedItem) {
      const nextIndex = Math.min(index + 1, filteredItems.length - 1);
      setFocusedItem(filteredItems[nextIndex]);
    } else {
      setFocusedItem(filteredItems[0]);
    }
  };

  const focusPreviousItemInPopup = () => {
    const index = filteredItems.findIndex((item) => item === focusedItem);
    if (focusedItem) {
      const previousIndex = Math.max(index - 1, 0);
      setFocusedItem(filteredItems[previousIndex]);
    } else {
      setFocusedItem(filteredItems[items.length - 1]);
    }
  };

  return (
    <div>
      <Label htmlFor="dropdown-input">{label}</Label>
      <div ref={comboboxWrapperRef}>
        {/* <span id="dropdown-listitem-description">there are {filteredItems.length} items</span> */}
        <ComboboxSelection
          id="dropdown-input"
          autoComplete="off"
          role="combobox"
          aria-activedescendant={expanded && focusedItem ? `dropdown-listitem-${focusedItem.id}` : undefined}
          aria-controls="dropdown-listitem-popup"
          aria-expanded={expanded && !!filteredItems.length}
          aria-autocomplete="list"
          // aria-describedby="dropdown-listitem-description"
          ref={comboboxInputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setExpanded(true);
            setFocusedItem(undefined);
          }}
          onClick={() => {
            if (!expanded) {
              handleWidgetFocus();
            }
          }}
          onBlur={(e) => {
            if (!comboboxWrapperRef.current?.contains(e.relatedTarget as Node)) {
              handleWidgetBlur();
            }
          }}
          onKeyDown={(e) => {
            switch (e.key) {
              case "ArrowDown": {
                e.preventDefault();
                if (expanded) {
                  focusNextItemInPopup();
                } else {
                  expandPopup();
                }
                break;
              }
              case "ArrowUp": {
                e.preventDefault();
                if (expanded) {
                  focusPreviousItemInPopup();
                } else {
                  expandPopup();
                }
                break;
              }
              case "Enter": {
                // e.preventDefault();
                if (expanded) {
                  collapsePopupWithSelection();
                } else {
                  expandPopup();
                }
                break;
              }
              case "Escape":
                if (!expanded) {
                  return;
                }
                e.preventDefault();
                collapsePopupWithoutSelection();
                break;
            }
          }}
        />
        <ComboboxListPositioning>
          <ComboboxList $expanded={expanded && !!filteredItems.length} role="listbox" id="dropdown-listitem-popup">
            {filteredItems.map((item, index) => {
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
                  aria-current={selected}
                  // aria-selected={focused}
                  // {...(selected && { "aria-selected": true })}
                  // aria-selected={selected}
                  $selected={selected}
                  $focused={focused}
                  onClick={() => {
                    selectItem(item);
                  }}
                  onMouseEnter={() => {
                    setFocusedItem(item);
                  }}
                  onMouseOut={() => {
                    setFocusedItem(undefined);
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

const ComboboxSelection = styled.input`
  background: #fff;
  border: 1px solid #888;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  outline: none;
  color: #000;

  &:focus {
    outline: #baf solid 1px;
  }
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
