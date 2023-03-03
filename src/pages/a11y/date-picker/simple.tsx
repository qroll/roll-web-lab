import { Checklist } from "../../../components/common/checklist";
import { Page, PageContent } from "../../../components/common/page";
import { Type } from "../../../components/typography/type";
import { SimpleDatePicker } from "../../../modules/date-picker/simple-date-picker";

export default function SimpleDatePickerPage() {
  return (
    <Page>
      <PageContent>
        <Type.Text>
          Using <code>grid</code> role is suitable here because a calendar is two-dimensional and is interactive
        </Type.Text>
        <Type.H2 size="h300" mt="m" bold>
          WAI-ARIA checklist
        </Type.H2>
        <Checklist
          items={[
            {
              checked: true,
              label: "`grid` role",
              mandatory: true,
              remark: "Set on the widget",
            },
            {
              checked: true,
              label: "`row` role",
              mandatory: true,
              remark: "Contains grid cell elements",
            },
            {
              checked: true,
              label: "`gridcell` role",
              mandatory: true,
              remark: "Set on a cell",
            },
          ]}
        />
        <Type.H3 size="h200" mt="xs" bold>
          grid
        </Type.H3>
        <Checklist
          items={[
            {
              checked: true,
              label: "`aria-current`",
              mandatory: true,
              remark: "Set on the element that represents the current value.",
            },
            {
              checked: true,
              label: "`aria-activedescendant`",
              mandatory: true,
              remark: "Set on the current active element",
            },
            {
              checked: true,
              label: "`aria-multiselectable`",
              remark: "Specifies if more than one item can be selected",
            },
            {
              checked: true,
              label: "`aria-readonly`",
              remark: "Specifies if the element is not editable (but still operable)",
            },
          ]}
        />
        <Type.H3 size="h200" mt="xs" bold>
          gridcell
        </Type.H3>
        <Checklist
          items={[
            {
              checked: true,
              label: "`aria-selected`",
              mandatory: true,
              remark: "Set on selectable items",
            },
            {
              checked: true,
              label: "`aria-disabled`",
              remark: "Specifies if item is disabled",
            },
          ]}
        />
        <SimpleDatePicker />

        <Type.H2 size="h300" mt="m" bold>
          References
        </Type.H2>
        <Type.Text size="h200">
          <a href="https://sarahmhigley.com/writing/grids-part1">https://sarahmhigley.com/writing/grids-part1</a>
        </Type.Text>
        <Type.Text size="h200">
          <a href="https://www.levelaccess.com/blog/how-not-to-misuse-aria-states-properties-and-roles">
            https://www.levelaccess.com/blog/how-not-to-misuse-aria-states-properties-and-roles
          </a>
        </Type.Text>
      </PageContent>
    </Page>
  );
}
