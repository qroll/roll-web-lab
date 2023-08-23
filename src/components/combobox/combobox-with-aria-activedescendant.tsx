import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Nullable } from "../common/types";

export type ComboboxItem = { id: number; label: string };

interface ComboboxWithAriaActivedescendantProps {
  items: ComboboxItem[];
  label: string;
  onChange?: (value: Nullable<ComboboxItem>) => void;
  value?: Nullable<ComboboxItem>;
}

export function ComboboxWithAriaActivedescendant(props: ComboboxWithAriaActivedescendantProps) {
  const { items, label, value, onChange } = props;

  const [selectedItem, setSelectedItem] = useState<Nullable<ComboboxItem>>(value);
  const [focusedItem, setFocusedItem] = useState<Nullable<ComboboxItem>>(value);
  const [expanded, setExpanded] = useState(false);
  const comboboxWrapperRef = useRef<HTMLDivElement>(null);
  const comboboSelectionRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLLIElement[]>([]);
  const nonItemRef = useRef<HTMLLIElement>(null);
  const ignoreHoverWhenNavigatingRef = useRef(false);

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  const onComboboxBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.nativeEvent.relatedTarget || !comboboxWrapperRef.current?.contains(e.nativeEvent.relatedTarget as Node)) {
      setExpanded(false);
    }
  };

  const onComboboxClick = () => {
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
  };

  const onEmptyItemSelect = () => {
    setExpanded(false);
    comboboSelectionRef.current?.focus();
    onChange?.(null);
  };

  const onEmptyItemHover = () => {
    setFocusedItem(null);
    nonItemRef.current?.scrollIntoView();
  };

  const onItemSelect = (item: ComboboxItem) => () => {
    setExpanded(false);
    comboboSelectionRef.current?.focus();
    onChange?.(item);
  };

  const onItemHover = (item: ComboboxItem) => () => {
    if (ignoreHoverWhenNavigatingRef.current) {
      ignoreHoverWhenNavigatingRef.current = false;
      return;
    }
    setFocusedItem(item);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        if (!expanded) {
          return;
        }
        e.preventDefault();
        focusNextItem();
        break;
      case "ArrowUp":
        if (!expanded) {
          return;
        }
        e.preventDefault();
        focusPrevItem();
        break;

      case "Enter":
      // spacebar
      case " ":
        e.preventDefault();
        onConfirm();
        break;
      case "Escape":
        if (!expanded) {
          return;
        }
        e.preventDefault();
        onCancel();
        break;
    }
  };

  const focusNextItem = () => {
    ignoreHoverWhenNavigatingRef.current = true;

    const index = items.findIndex((item) => item === focusedItem);
    if (index === -1) {
      setFocusedItem(items[0]);
      itemRef.current[0].scrollIntoView();
    } else {
      const nextIndex = Math.min(index + 1, items.length - 1);
      setFocusedItem(items[nextIndex]);
      itemRef.current[nextIndex].scrollIntoView();
    }
  };

  const focusPrevItem = () => {
    ignoreHoverWhenNavigatingRef.current = true;

    const index = items.findIndex((item) => item === focusedItem);
    if (index === -1) {
      // likely on the empty item, do nothing
    } else if (index === 0) {
      // already on the first item, so move to the empty item
      setFocusedItem(null);
      nonItemRef.current?.scrollIntoView();
    } else {
      const previousIndex = Math.max(index - 1, 0);
      setFocusedItem(items[previousIndex]);
      itemRef.current[previousIndex].scrollIntoView();
    }
  };

  const onConfirm = () => {
    if (expanded) {
      setExpanded(false);
      comboboSelectionRef.current?.focus();
      onChange?.(focusedItem);
    } else {
      setExpanded(true);
    }
  };

  const onCancel = () => {
    setExpanded(false);
    comboboSelectionRef.current?.focus();
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div>
      <Label htmlFor="dropdown-input">{label}</Label>
      <div ref={comboboxWrapperRef}>
        <ComboboxSelection
          role="combobox"
          aria-labelledby="dropdown-label"
          aria-activedescendant={expanded ? `dropdown-listitem-${focusedItem ? focusedItem.id : "none"}` : undefined}
          aria-controls="dropdown-listitem-popup"
          aria-expanded={expanded}
          aria-readonly={false}
          id="dropdown-input"
          ref={comboboSelectionRef}
          tabIndex={0}
          $expanded={expanded}
          onBlur={onComboboxBlur}
          onClick={onComboboxClick}
          onKeyDown={onKeyDown}
          value={selectedItem ? selectedItem.label : "---"}
        />
        <ComboboxListPositioning>
          <ComboboxList $expanded={expanded} role="listbox" id="dropdown-listitem-popup">
            <ComboboxListItem
              ref={nonItemRef}
              id={`dropdown-listitem-none`}
              role="option"
              aria-selected={!selectedItem}
              $selected={!selectedItem}
              $focused={!focusedItem}
              onClick={onEmptyItemSelect}
              onMouseOver={onEmptyItemHover}
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
                  onClick={onItemSelect(item)}
                  onMouseOver={onItemHover(item)}
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
