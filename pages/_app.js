import "../styles/index.css";
import { TinaCMS, TinaProvider } from "tinacms";
import { ContentfulClient } from "@tinacms/react-tinacms-contentful";
import { TinaContentfulProvider } from "@tinacms/react-tinacms-contentful";
import { useContentfulEditing } from "@tinacms/react-tinacms-contentful";
import { ContentfulLinkedSelectField } from "@tinacms/react-tinacms-contentful";
import { BlocksFieldPlugin } from "@tinacms/react-tinacms-contentful";
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
