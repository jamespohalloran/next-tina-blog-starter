import { useContentfulAuthRedirect } from "../../components/react-tinacms-contentful/useContentfulAuthRedirect";
export default function Authorizing() {
  useContentfulAuthRedirect();
  return <h2>Authorizing with Contentful, please wait...</h2>;
}
