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
        <LinkList items={[{ label: "Checkbox", href: "/a11y/checkbox" }]} />
      </PageContent>
    </Page>
  );
};

export default Home;
