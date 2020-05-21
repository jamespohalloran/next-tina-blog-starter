import Box from "@tds/core-box";
import Button from "@tds/core-button";
import DisplayHeading from "@tds/core-display-heading";
import Paragraph from "@tds/core-paragraph";

const BannerText = ({ onDownloadClick, title, subtitle, buttonText }) => (
  <Box between={5}>
    <DisplayHeading>{title}</DisplayHeading>
    <Paragraph>{subtitle}</Paragraph>

    <div>
      <Button onClick={onDownloadClick}>{buttonText}</Button>
    </div>
  </Box>
);

export default BannerText;
