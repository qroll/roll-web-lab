import { Checklist } from "../../../components/common/checklist";
import { Page, PageContent } from "../../../components/common/page";
import { Type } from "../../../components/typography/type";
import { TreeList } from "../../../modules/tree/tree-list";

export default function TreeListPage() {
  return (
    <Page>
      <PageContent>
        <Type.Text>A tree list is used to represent a hierarchy of items.</Type.Text>
        <Type.Text>Note: For some reason Voiceover on MacOS announces this as a table. I give up. 😔</Type.Text>
        <Type.H2 size="h300" mt="m" bold>
          WAI-ARIA checklist
        </Type.H2>
        <Checklist
          items={[
            {
              checked: true,
              label: "`role=tree`",
              mandatory: true,
            },
            {
              checked: true,
              label: "`role=treeitem`",
              mandatory: true,
              remark: "Set on the list items",
            },
            {
              checked: true,
              label: "`role=group`",
              mandatory: true,
              remark: "Set on the container that has the nested list items",
            },
            {
              checked: true,
              label: "`aria-selected`",
            },
            {
              checked: true,
              label: "`aria-expanded`",
            },
          ]}
        />
        <TreeList
          data={[
            {
              label: "Group A",
              key: "A",
              children: [
                {
                  label: "Subgroup A",
                  key: "A",
                  children: [
                    { label: "Item A", key: "A" },
                    { label: "Item B", key: "B" },
                  ],
                },
                {
                  label: "Subgroup B",
                  key: "B",
                  children: [
                    { label: "Item B", key: "B" },
                    { label: "Item C", key: "C" },
                  ],
                },
              ],
            },
            {
              label: "Group 1",
              key: "1",
              children: [
                {
                  label: "Subgroup 1",
                  key: "1",
                  children: [
                    { label: "Item A", key: "A" },
                    { label: "Item B", key: "B" },
                  ],
                },
              ],
            },
          ]}
        />
      </PageContent>
    </Page>
  );
}
