import { useState } from "react";
import { Nullable } from "../../modules/common/types";
import { Page } from "../../modules/combobox/combobox-page";
import {
  ComboboxWithAriaActivedescendant,
  ComboboxWithAriaActivedescendantItem,
} from "../../modules/combobox/combobox-with-aria-activedescendant";

export default function ComboboxWithAriaActivedescendantPage() {
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
  const [value, setValue] = useState<Nullable<ComboboxWithAriaActivedescendantItem>>(null);

  return (
    <Page
      header="Combobox with aria-activedescendant"
      description="Keyboard-controllable. Uses aria-activedescendant to set focus for screen readers."
      prev={{ link: "/combobox/tabindex", label: "Prev: Combobox with a11y-compliant tabindex" }}
    >
      <ComboboxWithAriaActivedescendant
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
