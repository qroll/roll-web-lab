import { useState } from "react";
import { Nullable } from "../../../components/common/types";
import { ComboboxPage } from "../../../components/combobox/combobox-page";
import { ComboboxWithTabindex, ComboboxWithTabindexItem } from "../../../components/combobox/combobox-with-tabindex";
import { Type } from "../../../components/typography/type";
import { Checklist } from "../../../components/common/checklist";

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
    <ComboboxPage
      header="Combobox with a11y-compliant roving tabindex"
      description={
        <>
          <Type.P mb="s">Keyboard-controllable, and clicking on the label focuses the input.</Type.P>
          <Type.P mb="s">
            This uses a tabindex to manage focus between the input and the selected item in the popup.
          </Type.P>
          <Type.H2 size="h300" mt="m" bold>
            WAI-ARIA checklist
          </Type.H2>
          <Checklist
            items={[
              {
                checked: true,
                label: "role=combobox",
              },
              {
                checked: false,
                label: "aria-autocomplete",
                remark: "Not applicable as this does not have search functionality",
              },
              {
                checked: true,
                label: "aria-expanded",
              },
              {
                checked: true,
                label: "role=listbox",
                remark: "Set on the popup",
              },
              {
                checked: false,
                label: "aria-haspopup",
                remark: "Not required if the popup role is already listbox",
              },
              {
                checked: false,
                label: "aria-activedescendant",
                remark: "Not applicable",
              },
            ]}
          />
        </>
      }
    >
      <ComboboxWithTabindex
        label="Label"
        items={items}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
    </ComboboxPage>
  );
}
