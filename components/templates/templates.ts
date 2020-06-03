import Banner from "../blocks/banner/BannerBlock";
import CollapsibleBlock from "../blocks/collapsible/CollapsibleBlock";
import { Field } from "tinacms";

const Templates: { [key: string]: Partial<Field> } = {
  ["banner"]: Banner,
  ["collapsible"]: CollapsibleBlock,
};

export default Templates;
