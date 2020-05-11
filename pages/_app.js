import "../styles/index.css";
import { withTina, TinaCMS, TinaProvider } from "tinacms";

class ContentfulClient {
  constructor({ space, accessToken }) {
    this.space = space;
    this.client = require("contentful-management").createClient({
      accessToken,
    });
  }

  async save(id, fieldContents) {
    console.log("Saving entity: ", id, fieldContents);
  }
}

function MyApp({ Component, pageProps }) {
  const tinaConfig = {
    apis: {
      contentful: new ContentfulClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
      }),
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
