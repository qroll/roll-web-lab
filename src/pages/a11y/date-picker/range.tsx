import { Checklist } from "../../../components/common/checklist";
import { Page, PageContent } from "../../../components/common/page";
import { Type } from "../../../components/typography/type";
import { RangeDatePicker } from "../../../modules/date-picker/range-date-picker";

export default function RangeDatePickerPage() {
  return (
    <Page>
      <PageContent>
        <Type.Text>
          A date range picker composed of multiple inputs — start and end date fields for keyboard input and a calendar
          widget for visual selection
        </Type.Text>
        <Type.H2 size="h300" mt="m" bold>
          WAI-ARIA checklist
        </Type.H2>
        <Checklist
          items={[
            {
              checked: true,
              label: "`group` role",
              mandatory: true,
              remark: "Groups related inputs together; in this case, the day, month and year fields",
            },
            {
              checked: true,
              label: "`grid` role",
              mandatory: true,
              remark: "Set on the calendar widget",
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
            {
              checked: true,
              label: "`button` role",
              mandatory: true,
              remark: "Set on a child in the gridcell to indicate interactivity",
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
              label: "`aria-current=date`",
              mandatory: true,
              remark: "Set on the element that represents the current date.",
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
              mandatory: true,
              remark: "Specifies if more than one item can be selected",
            },
          ]}
        />
        <Type.H3 size="h200" mt="xs" bold>
          gridcell button
        </Type.H3>
        <Checklist
          items={[
            {
              checked: true,
              label: "`aria-selected`",
              mandatory: true,
              remark: "Set on selected items",
            },
            {
              checked: true,
              label: "`aria-disabled`",
              remark: "Specifies if item is disabled",
            },
          ]}
        />
        <RangeDatePicker onChange={(s, e) => console.log(s, e)} />
        <RangeDatePicker withButtons />
        <RangeDatePicker disabled />

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
