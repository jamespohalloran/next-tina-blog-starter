import { useContentfulAuthRedirect } from "../../react-tinacms-contentful/src/useContentfulAuthRedirect";
export default function Authorizing() {
  useContentfulAuthRedirect();
  return <h2>Authorizing with Contentful, please wait...</h2>;
}
