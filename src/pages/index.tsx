import type { NextPage } from "next";
import Head from "next/head";
import { Page, PageContent } from "../components/common/page";
import { Type } from "../components/typography/type";
import { LinkList } from "../modules/main/main";

const Home: NextPage = () => {
  return (
    <Page>
      <Head>
        <title>Web Lab</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContent>
        <Type.H1 my="l" semibold>
          Web Lab
        </Type.H1>
        <Type.H2 my="l">Components</Type.H2>
        <LinkList items={[{ label: "Typography", href: "/components/typography" }]} />
        <Type.H2 my="l">Accessibility experiments</Type.H2>
        <LinkList
          items={[
            { label: "Checkbox", href: "/a11y/checkbox" },
            { label: "Combobox", href: "/a11y/combobox/simple" },
            { label: "Calendar", href: "/a11y/date-picker/simple" },
            { label: "Date range picker", href: "/a11y/date-picker/range" },
            { label: "Treelist", href: "/a11y/tree/tree-list" },
            { label: "Treelist (multi-select)", href: "/a11y/tree/multi-select-tree-list" },
          ]}
        />
      </PageContent>
    </Page>
  );
};

export default Home;
