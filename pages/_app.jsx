import "../styles/index.css";
import { TinaCMS, withTina } from "tinacms";
import { TinaProvider } from "tinacms";
import { ContentfulClient } from "../react-tinacms-contentful/src/contentful-client";
import { TinaContentfulProvider } from "../react-tinacms-contentful/src/TinacmsContentfulProvider";
import { useContentfulEditing } from "../react-tinacms-contentful/src/useContentfulEditing";

function MyApp({ Component, pageProps }) {
  const cms = new TinaCMS({
    apis: {
      contentful: new ContentfulClient({
        clientId: process.env.CONTENTFUL_CLIENT_ID,
        redirectUrl: process.env.CONTENTFUL_AUTH_REDIRECT_URL,
      }),
    },
    sidebar: {
      hidden: !pageProps.preview,
    },
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
    <button onClick={contentful.enterEditMode}>
      {editMode ? "Exit Edit Mode" : "Edit This Site"}
    </button>
  );
};

export default MyApp;
