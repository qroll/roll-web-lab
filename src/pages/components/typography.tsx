import { Page, PageContent } from "../../components/common/page";
import { Type } from "../../components/typography/type";
import { TypographyElements } from "../../modules/typography/elements";
import { TypographySizes } from "../../modules/typography/size";
import { TypographySpacing } from "../../modules/typography/spacing";
import { TypographyStyling } from "../../modules/typography/styling";

const TypographyPage = () => {
  return (
    <Page>
      <PageContent>
        <Type.H1 bold>You must first invent the universe</Type.H1>
        <Type.Text mb="s">Typography is a core building block of every web application.</Type.Text>
        <Type.Text>
          This goes with a semantics-first approach, because header hierarchy and text nesting have implications on
          accessibility. The visual style can be configured through props.
        </Type.Text>
        <TypographyElements />
        <TypographySizes />
        <TypographyStyling />
        <TypographySpacing />
      </PageContent>
    </Page>
  );
};

export default TypographyPage;
