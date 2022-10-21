import { useState } from "react";
import { SimpleCombobox, SimpleComboboxItem } from "../../modules/combobox/simple-combobox";
import { Nullable } from "../../modules/common/types";
import { Page } from "../../modules/combobox/combobox-page";

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
      description="Lets you click to expand or collapse the list of options and select a single option. Click outside of the
      combobox to collapse it."
      next={{ link: "/combobox/combobox-with-keyboard-controls", label: "Next: Combobox with keyboard controls" }}
    >
      <SimpleCombobox
        label="Label"
        items={items}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, deleniti, aliquid nobis voluptas
        repellendus alias amet asperiores tenetur dolorum nisi quidem mollitia ab adipisci consequatur doloribus error
        soluta quaerat voluptatibus.
      </p>
    </Page>
  );
}
