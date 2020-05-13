import "../styles/index.css";
import { TinaCMS, TinaProvider } from "tinacms";
import { ContentfulClient } from "../components/react-tinacms-contentful/contentful-client";

function MyApp({ Component, pageProps }) {
  const tinaConfig = {
    apis: {
      contentful: new ContentfulClient(
        process.env.CONTENTFUL_SPACE_ID,
        "/api/proxy"
      ),
    },
    sidebar: {
      hidden: false,
      position: "displace",
    },
    // toolbar: {
    //   hidden: !pageProps.preview,
    // },
  };

  const cms = React.useMemo(() => new TinaCMS(tinaConfig), []);

  return (
    <TinaProvider cms={cms}>
      <Component {...pageProps} />
    </TinaProvider>
  );
}

export default MyApp;
