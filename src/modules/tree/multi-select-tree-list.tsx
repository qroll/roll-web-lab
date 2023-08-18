import { CaretRightIcon } from "@lifesg/react-icons";
import { enableMapSet, produce } from "immer";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Checkbox } from "../../components/checkbox/checkbox";

type NestedData = { label: string; key: string; children?: NestedData[] };

interface TreeListProps {
  data: NestedData[];
}

type NormalisedData = {
  label: string;
  key: string;
  keyPath: string[];
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  indeterminate: boolean;
  children?: Map<string, NormalisedData>;
};

type NormalisedMap = Map<string, NormalisedData>;

type RefData = {
  ref?: HTMLLIElement | null;
  children?: Record<string, RefData>;
};

type RefDataMap = Record<string, RefData>;

enableMapSet();

export function MultiSelectTreeList({ data }: TreeListProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [selectedKeyPaths, setSelectedKeyPaths] = useState<string[][]>([]);
  const [list, setList] = useState<NormalisedMap>(() => buildSelectionState(normaliseData(data), selectedKeyPaths));
  const listItemRefs = useRef<RefDataMap>({});

  const visibleKeyPaths = useMemo(() => {
    const keyPaths: string[][] = [];

    const addVisibleItems = (list: NormalisedMap) => {
      for (const item of list.values()) {
        keyPaths.push(item.keyPath);
        if (item.expanded && item.children) {
          addVisibleItems(item.children);
        }
      }
    };

    addVisibleItems(list);

    return keyPaths;
  }, [list]);

  const focusedItemKeyPath = visibleKeyPaths[focusIndex];

  const updateListItemRef = (ref: HTMLLIElement | null, keyPath: string[]) => {
    const setRef = (keyPath: string[], parent: RefDataMap): void => {
      const [currKey, ...remainingKeys] = keyPath;
      const item = parent[currKey];
      if (!item) {
        parent[currKey] = { ref: undefined, children: {} };
      }
      if (!remainingKeys.length) {
        parent[currKey].ref = ref;
        return;
      }
      setRef(remainingKeys, parent[currKey].children!);
    };

    setRef(keyPath, listItemRefs.current);
  };

  const renderItem = (item: NormalisedData) => {
    const { key, keyPath, expanded, selected, children, label } = item;
    const focused = isEqual(keyPath, focusedItemKeyPath);

    return (
      <TreeItem
        role="treeitem"
        key={key}
        aria-selected={selected}
        aria-expanded={!!children ? expanded : undefined}
        tabIndex={focused ? 0 : -1}
        ref={(r) => updateListItemRef(r, keyPath)}
        onClick={(event) => {
          event.stopPropagation();
          const nextList = produce(list, (draft) => {
            const draftItem = getItemAtKeyPath(draft, keyPath);
            if (draftItem) {
              draftItem.expanded = !draftItem.expanded;
            }
          });
          setList(nextList);
        }}
        onFocus={(event) => {
          event.stopPropagation();
          if (!isEqual(keyPath, focusedItemKeyPath)) {
            const index = visibleKeyPaths.findIndex((v) => isEqual(v, keyPath));
            setFocusIndex(index);
          }
        }}
        onKeyDown={(event) => {
          if (!focused) {
            return;
          }

          if (event.key === "ArrowLeft") {
            event.stopPropagation();
            const nextList = produce(list, (draft) => {
              const draftItem = getItemAtKeyPath(draft, keyPath);
              if (draftItem) {
                draftItem.expanded = false;
              }
            });
            setList(nextList);
          } else if (event.key === "ArrowRight") {
            event.stopPropagation();
            const nextList = produce(list, (draft) => {
              const draftItem = getItemAtKeyPath(draft, keyPath);
              if (draftItem) {
                draftItem.expanded = true;
              }
            });
            setList(nextList);
          } else if (event.key === "ArrowDown") {
            event.stopPropagation();
            const nextFocusIndex = Math.min(visibleKeyPaths.length - 1, focusIndex + 1);
            setFocusIndex(nextFocusIndex);
            getRefAtKeyPath(listItemRefs.current, visibleKeyPaths[nextFocusIndex])?.ref?.focus();
          } else if (event.key === "ArrowUp") {
            event.stopPropagation();
            const nextFocusIndex = Math.max(0, focusIndex - 1);
            setFocusIndex(nextFocusIndex);
            getRefAtKeyPath(listItemRefs.current, visibleKeyPaths[nextFocusIndex])?.ref?.focus();
          } else if (event.key === " ") {
            event.stopPropagation();
            // remove all subitems first
            const newSelection: string[][] = selectedKeyPaths.filter((keyPath) => {
              return !isSubset(keyPath, item.keyPath);
            });
            if (item.indeterminate || !item.checked) {
              // if not selected, select all subitems
              newSelection.push(...getSubitemsAtKeyPath(list, keyPath));
            }
            setSelectedKeyPaths(newSelection);
            setList(buildSelectionState(list, newSelection));
          }
        }}
      >
        <TreeItemLabel $focused={focused} $selected={selected}>
          {children && (
            <Icon
              aria-hidden
              onClick={(event) => {
                event.stopPropagation();
                const nextList = produce(list, (draft) => {
                  const draftItem = getItemAtKeyPath(draft, keyPath);
                  if (draftItem) {
                    draftItem.expanded = !draftItem.expanded;
                  }
                });
                setList(nextList);
              }}
            />
          )}
          <Checkbox
            tabIndex={-1}
            checked={item.checked}
            indeterminate={item.indeterminate}
            onChange={() => {
              // remove all subitems first
              const newSelection: string[][] = selectedKeyPaths.filter((keyPath) => {
                return !isSubset(keyPath, item.keyPath);
              });
              if (item.indeterminate || !item.checked) {
                // if not selected, select all subitems
                newSelection.push(...getSubitemsAtKeyPath(list, keyPath));
              }
              setSelectedKeyPaths(newSelection);
              setList(buildSelectionState(list, newSelection));
            }}
          />
          {label}
        </TreeItemLabel>
        {children && expanded && (
          <Group role="group">{Array.from(children.values()).map((child) => renderItem(child))}</Group>
        )}
      </TreeItem>
    );
  };

  return (
    <>
      <Tree role="tree" aria-describedby="description">
        {Array.from(list.values()).map((item) => renderItem(item))}
        <div id="description">
          Use the up and down arrow keys to navigate through the list. Press space to select an item. Press the right
          arrow key to expand the category. Press the left arrow key to collapse the categry.
        </div>
      </Tree>
    </>
  );
}

// HELPER

const isEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < b.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

const isSubset = (a: string[], subset: string[]) => {
  for (let i = 0; i < subset.length; i++) {
    if (a[i] !== subset[i]) {
      return false;
    }
  }
  return true;
};

const normaliseData = (data: NestedData[]) => {
  const normalise = (item: NestedData, keyPath: string[]): NormalisedData => {
    return {
      label: item.label,
      key: item.key,
      keyPath: [...keyPath, item.key],
      expanded: false,
      selected: false,
      checked: false,
      indeterminate: false,
      children: item.children && toMap(item.children, [...keyPath, item.key]),
    };
  };

  const toMap = (list: NestedData[], keyPath: string[]) => {
    const map: NormalisedMap = new Map();
    for (const item of list) {
      map.set(item.key, normalise(item, keyPath));
    }
    return map;
  };

  return toMap(data, []);
};

const buildSelectionState = (data: NormalisedMap, selectedKeyPaths: string[][]) => {
  return produce(data, (draft) => {
    const update = (item: NormalisedData) => {
      const isSelected = !!selectedKeyPaths.find((keyPath) => isEqual(keyPath, item.keyPath));
      if (item.children) {
        item.children.forEach((child) => update(child));

        const checkCount = [...item.children.values()].filter((child) => child.checked).length;
        const totalCount = [...item.children.values()].length;
        const isChecked = item.children.size > 0 && checkCount === totalCount;
        const isIndeterminate =
          [...item.children.values()].some((child) => child.indeterminate) || (checkCount > 0 && !isChecked);

        item.selected = isSelected;
        item.checked = isChecked;
        item.indeterminate = isIndeterminate;
      } else {
        item.selected = isSelected;
        item.checked = isSelected;
        item.indeterminate = false;
      }
    };

    draft.forEach((item) => {
      update(item);
    });
  });
};

const getItemAtKeyPath = (data: NormalisedMap, keyPath: string[]): NormalisedData | undefined => {
  const [currKey, ...remainingKeys] = keyPath;
  const item = data.get(currKey);
  if (!remainingKeys.length || !item) {
    return item;
  }
  return getItemAtKeyPath(item.children!, remainingKeys);
};

const getRefAtKeyPath = (data: RefDataMap, keyPath: string[]): RefData | undefined => {
  const [currKey, ...remainingKeys] = keyPath;
  const item = data[currKey];
  if (!remainingKeys.length || !item) {
    return item;
  }
  return getRefAtKeyPath(item.children!, remainingKeys);
};

const getSubitemsAtKeyPath = (data: NormalisedMap, keyPath: string[]): string[][] => {
  const item = getItemAtKeyPath(data, keyPath);

  const getSubItem = (item: NormalisedData): string[][] => {
    if (item.children) {
      return [...item.children.values()].map((child) => getSubItem(child)).flat();
    }
    return [item.keyPath];
  };

  return item ? getSubItem(item) : [];
};

// STYLES

const Tree = styled.ul`
  margin: 0;
  list-style: none;
`;

const TreeItemLabel = styled.div<{ $focused: boolean; $selected: boolean }>`
  display: flex;
  align-items: center;

  ${(props) =>
    props.$selected &&
    `
    background: #dea;
    font-weight: 500;
  `}
`;

const TreeItem = styled.li`
  margin: 0;
  list-style: none;
  outline: none;

  &:focus > ${TreeItemLabel} {
    outline: 1px solid blue;
  }
`;

const Group = styled.ul`
  margin: 0 0 0 2rem;
`;

const Icon = styled(CaretRightIcon)`
  height: 1.5rem;
  width: 1.5rem;
`;
