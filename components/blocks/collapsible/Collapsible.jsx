import { ExpandCollapse } from "@tds/core-expand-collapse";
import Box from "@tds/core-box";
import Paragraph from "@tds/core-paragraph";
import Text from "@tds/core-text";

const Collapsible = () => (
  <ExpandCollapse topDivider={false} tag="h2">
    <ExpandCollapse.Panel
      id="monthly-plan"
      header="Monthly Home Phone plan"
      subtext="Jul 10-Aug 9"
      tertiaryText="$20.50"
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
  </ExpandCollapse>
);

export default Collapsible;
