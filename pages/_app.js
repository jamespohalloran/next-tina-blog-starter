import "../styles/index.css";
import { TinaCMS, TinaProvider } from "tinacms";

class ContentfulClient {
  constructor({ space, accessToken, proxy }) {
    this.space = space;
    this.client = require("contentful-management").createClient({
      accessToken,
    });
    this.proxy = proxy;
  }

  async save(id, version, contentModel, fields) {
    console.log("Saving entity: ", id, fields);
    return this.req({
      url: `https://api.contentful.com/spaces/${this.space}/environments/master/entries/${id}`,
      method: "PUT",
      headers: {
        "X-Contentful-Content-Type": contentModel,
        "X-Contentful-Version": version,
        "Content-Type": "application/vnd.contentful.management.v1+json",
      },
      data: {
        fields: fields,
      },
    }).then(() => window.location.reload());
  }

  async req(data) {
    const response = await this.proxyRequest(data);
    return response;
  }

  /**
   * The methods below maybe don't belong on GitHub client, but it's fine for now.
   */
  proxyRequest(data) {
    return fetch(this.proxy, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

function MyApp({ Component, pageProps }) {
  const tinaConfig = {
    apis: {
      contentful: new ContentfulClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
        proxy: "/api/proxy",
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
