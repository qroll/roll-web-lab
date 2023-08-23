import { useState } from "react";
import { Nullable } from "../../../components/common/types";
import { ComboboxPage } from "../../../components/combobox/combobox-page";
import {
  ComboboxWithAriaActivedescendant,
  ComboboxItem,
} from "../../../components/combobox/combobox-with-aria-activedescendant";
import { Type } from "../../../components/typography/type";
import { Checklist } from "../../../components/common/checklist";

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
  const [value, setValue] = useState<Nullable<ComboboxItem>>(null);

  return (
    <ComboboxPage
      header="Combobox with aria-activedescendant"
      description={
        <>
          <Type.P mb="s">Keyboard-controllable, and clicking on the label focuses the input.</Type.P>
          <Type.P mb="s">This uses aria-activedescendant to set focus for screen readers.</Type.P>
          <Type.H2 size="h300" mt="m" bold>
            WAI-ARIA checklist
          </Type.H2>
          <Checklist
            items={[
              {
                checked: true,
                label: "`combobox` role",
                mandatory: true,
                remark: "Set on the element that displays the current value (typically an input or div).",
              },
              {
                checked: true,
                label: "`listbox` role",
                mandatory: true,
                remark: "Set on the associated popup. `tree`, `grid`, `dialog` are also supported.",
              },
              {
                checked: false,
                label: "`button` role",
                remark:
                  "Set on the element that toggles popup visibility. This element is optional. It should not be part of the tab sequence and should not be a child of the combobox element.",
              },
              {
                checked: true,
                label: "Keyboard controls",
                remark: "Keyboard mechanisms to move focus between the combobox element and popup elements",
              },
            ]}
          />
          <Type.H3 size="h200" mt="xs" bold>
            Combobox properties
          </Type.H3>
          <Checklist
            items={[
              {
                checked: false,
                label: "`aria-autocomplete`",
                remark: "Required if autocomplete functionality is supported.",
              },
              {
                checked: true,
                label: "`aria-expanded`",
                mandatory: true,
                remark: "Specifies if the combobox is collapsed or expanded.",
              },
              {
                checked: false,
                label: "`aria-haspopup`",
                remark: "Specifies the role that the popup has. Defaults to `listbox`.",
              },
              {
                checked: true,
                label: "`aria-controls`",
                mandatory: true,
                remark: "Specifies the popup id.",
              },
              {
                checked: true,
                label: "`aria-activedescendant`",
                remark:
                  "Specifies the current active element within the popup. Alternatively the component can use a roving tab index to manage focus.",
              },
              {
                checked: false,
                label: "`aria-errormessage`",
              },
              {
                checked: false,
                label: "`aria-invalid`",
              },
              {
                checked: false,
                label: "`aria-readonly`",
              },
              {
                checked: false,
                label: "`aria-required`",
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
    </ComboboxPage>
  );
}
