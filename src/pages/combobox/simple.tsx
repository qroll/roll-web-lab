import { useState } from "react";
import { SimpleCombobox, SimpleComboboxItem } from "../../modules/combobox/simple-combobox";
import { Nullable } from "../../modules/common/types";
import { Page } from "../../modules/combobox/combobox-page";
import { Type } from "../../modules/typography/type";

export default function SimpleComboboxPage() {
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
  const [value, setValue] = useState<Nullable<SimpleComboboxItem>>(null);

  return (
    <Page
      header="Simple combobox"
      description={
        <>
          <Type.Text mb="s">
            This is the simplest possible implementation of a combobox, where interaction is done with a pointing device
            only.
          </Type.Text>
          <Type.Text mb="s">
            It lets you click the input to expand or collapse the list of options and select a single option. Clicking
            outside of the combobox collapses it.
          </Type.Text>
          <Type.Text mb="s">This is missing keyboard interactions and accessibility labelling.</Type.Text>
        </>
      }
    >
      <SimpleCombobox
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
