import { useState } from "react";
import { Nullable } from "../../modules/common/types";
import { Page } from "../../modules/combobox/combobox-page";
import { ComboboxWithTabindex, ComboboxWithTabindexItem } from "../../modules/combobox/combobox-with-tabindex";

export default function ComboboxWithTabindexPage() {
  const [items] = useState([
    { id: 1, label: "quirk" },
    { id: 2, label: "alpha" },
    { id: 3, label: "curd" },
    { id: 4, label: "lark" },
    { id: 5, label: "strong" },
    { id: 6, label: "apologetic" },
    { id: 7, label: "space" },
    { id: 8, label: "vanilla" },
  ]);
  const [value, setValue] = useState<Nullable<ComboboxWithTabindexItem>>(null);

  return (
    <Page
      header="Combobox with a11y-compliant roving tabindex"
      description="Keyboard-controllable. Adds a roving tabindex for screen readers."
      prev={{ link: "/combobox/keyboard", label: "Prev: Combobox with keyboard controls" }}
    >
      <ComboboxWithTabindex
        label="Label"
        items={items}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
    </Page>
  );
}
