import "../styles/index.css";
import { TinaCMS, TinaProvider } from "tinacms";
import { ContentfulClient } from "../components/react-tinacms-contentful/contentful-client";
import { TinaContentfulProvider } from "../react-tinacms-contentful/src/TinacmsContentfulProvider";
import { useContentfulEditing } from "../react-tinacms-contentful/src/useContentfulEditing";
import { ContentfulLinkedSelectField } from "../react-tinacms-contentful/src/ContentfulLinkedSelectField";
import { createEnumDeclaration } from "typescript";
import { BlocksFieldPlugin } from "../components/linked-blocks/linked-blocks";
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
      hidden: false,
      position: "displace",
    },
    // toolbar: {
    //   hidden: !pageProps.preview,
    // },
  };

  const cms = React.useMemo(() => new TinaCMS(tinaConfig), []);
  cms.fields.add({
    name: "contentful-linked-field",
    Component: ContentfulLinkedSelectField,
  });
  cms.fields.add(BlocksFieldPlugin);

  return (
    <TinaProvider cms={cms}>
      <TinaContentfulProvider
        editMode={pageProps.preview}
        enterEditMode={enterEditMode}
        exitEditMode={exitEditMode}
      >
        <EditLink editMode={false} />
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
