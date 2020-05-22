import "../styles/index.css";
import { TinaCMS, TinaProvider } from "tinacms";
import { ContentfulClient } from "../components/react-tinacms-contentful/contentful-client";
import { TinaContentfulProvider } from "../components/react-tinacms-contentful/TinacmsContentfulProvider";
import { useContentfulEditing } from "../components/react-tinacms-contentful/useContentfulEditing";
import { LinkedAuthorInput } from "../components/react-tinacms-contentful/LinkedAuthorInput";

function MyApp({ Component, pageProps }) {
  const tinaConfig = {
    apis: {
      contentful: new ContentfulClient({
        clientId: process.env.CONTENTFUL_CLIENT_ID,
        redirectUrl: process.env.CONTENTFUL_AUTH_REDIRECT_URL,
        space: process.env.CONTENTFUL_SPACE_ID,
        proxy: "/api/proxy",
      }),
    },
    sidebar: {
      hidden: !pageProps.preview,
      position: "displace",
    },
    // toolbar: {
    //   hidden: !pageProps.preview,
    // },
  };

  const cms = React.useMemo(() => new TinaCMS(tinaConfig), []);
  cms.fields.add({
    name: "linkedAuthor",
    Component: LinkedAuthorInput,
  });

  return (
    <TinaProvider cms={cms}>
      <TinaContentfulProvider
        editMode={pageProps.preview}
        enterEditMode={enterEditMode}
        exitEditMode={exitEditMode}
      >
        <EditLink editMode={pageProps.preview} />
        <Component {...pageProps} />
      </TinaContentfulProvider>
    </TinaProvider>
  );
}

const enterEditMode = () => {
  return fetch(`/api/preview`).then(() => {
    window.location.href = window.location.pathname;
  });
};
const exitEditMode = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload();
  });
};

export const EditLink = ({ editMode }) => {
  const contentful = useContentfulEditing();

  return (
    <button
      onClick={editMode ? contentful.exitEditMode : contentful.enterEditMode}
    >
      {editMode ? "Exit Edit Mode" : "Edit This Site"}
    </button>
  );
};

export default MyApp;
