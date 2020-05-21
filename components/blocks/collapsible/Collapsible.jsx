import { ExpandCollapse } from "@tds/core-expand-collapse";
import Box from "@tds/core-box";
import Paragraph from "@tds/core-paragraph";
import Text from "@tds/core-text";

const Collapsible = ({ panels = [] }) => {
  console.log(panels);
  return (
    <ExpandCollapse topDivider={false} tag="h2">
      {panels.map((panel) => {
        return (
          <ExpandCollapse.Panel
            id={panel.title.replace(" ", "-")}
            header={panel.title}
            subtext={panel.subtitle}
            tertiaryText={panel.tertiaryText}
          >
            <Box between={3}>
              <Paragraph size="medium">
                TELUS Home Phone $20.00
                <br />
                <Text size="small">
                  Includes Local Line, Call Display, and Voice Mail
                </Text>
              </Paragraph>

              <Paragraph size="medium">
                E 9-1-1 Provincial Network Fee $0.50
              </Paragraph>
            </Box>
          </ExpandCollapse.Panel>
        );
      })}
    </ExpandCollapse>
  );
};

export default Collapsible;
