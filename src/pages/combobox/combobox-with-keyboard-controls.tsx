import { useState } from "react";
import { Nullable } from "../../modules/common/types";
import { Page } from "../../modules/combobox/combobox-page";
import {
  ComboboxWithKeyboardControls,
  ComboboxWithKeyboardControlsItem,
} from "../../modules/combobox/combobox-with-keyboard-controls";

export default function ComboboxWithKeyboardControlsPage() {
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
  const [value, setValue] = useState<Nullable<ComboboxWithKeyboardControlsItem>>(null);

  return (
    <Page
      header="Combobox with keyboard controls"
      description="Keyboard-controllable. Focusable via Tab or Shift+Tab. Space/Enter on the selection bar when collapsed to expand the combobox. Arrow Up/Down to navigate between options. Space/Enter to confirm selection."
      prev={{ link: "/combobox/simple-combobox", label: "Prev: Simple combobox" }}
    >
      <ComboboxWithKeyboardControls
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
