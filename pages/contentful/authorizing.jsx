import { useContentfulAuthRedirect } from "@tinacms/react-tinacms-contentful";
export default function Authorizing() {
  useContentfulAuthRedirect();
  return <h2>Authorizing with Contentful, please wait...</h2>;
}
