import { useState } from "react";
import { Nullable } from "../../components/common/types";
import { Page } from "../../components/combobox/combobox-page";
import {
  ComboboxWithKeyboardControls,
  ComboboxWithKeyboardControlsItem,
} from "../../components/combobox/combobox-with-keyboard-controls";
import { Type } from "../../components/typography/type";

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
      description={
        <>
          <Type.Text mb="s">This enhances the simple combobox to be keyboard-controllable.</Type.Text>
          <Type.Text mb="s">
            It is focusable via <code>Tab</code> or <code>Shift+Tab</code>. When the combobox is collapsed,{" "}
            <code>Space/Enter</code> on the input bar expands the list of options. <code>Arrow Up/Down</code> navigates
            between options. <code>Space/Enter</code> confirms the current selection.
          </Type.Text>
          <Type.Text mb="s">This is still missing accessibility labelling.</Type.Text>
        </>
      }
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
