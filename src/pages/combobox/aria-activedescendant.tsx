import { useState } from "react";
import { Nullable } from "../../modules/common/types";
import { Page } from "../../modules/combobox/combobox-page";
import {
  ComboboxWithAriaActivedescendant,
  ComboboxWithAriaActivedescendantItem,
} from "../../modules/combobox/combobox-with-aria-activedescendant";
import { Type } from "../../modules/typography/type";
import { Checklist } from "../../modules/combobox/checklist";

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
      description={
        <>
          <Type.Text mb="s">Keyboard-controllable, and clicking on the label focuses the input.</Type.Text>
          <Type.Text mb="s">This uses aria-activedescendant to set focus for screen readers.</Type.Text>
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
                checked: true,
                label: "aria-activedescendant",
              },
            ]}
          />
        </>
      }
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
