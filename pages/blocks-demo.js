import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../components/container";
import Layout from "../components/layout";
import PostTitle from "../components/post-title";
import Head from "next/head";
import { useEffect } from "react";
import { useForm, usePlugin, useCMS } from "tinacms";
import BannerText from "../components/blocks/banner/Banner";
import {
  getCachedFormData,
  setCachedFormData,
} from "../components/react-tinacms-contentful/cachedFormData";
import Collapsible from "../components/blocks/collapsible/Collapsible";
import banner from "../components/blocks/banner/BannerBlock";

const axios = require("axios");

export default function Post({ page, preview }) {
  const router = useRouter();
  const cms = useCMS();

  const locale = "en-US";

  const id = page.sys.id;
  const contentType = page.sys.contentType.sys.id;

  useEffect(() => {
    setCachedFormData(id, {
      version: page.sys.version,
    });
  }, []);

  if (!router.isFallback && !page?.fields.slug[locale]) {
    return <ErrorPage statusCode={404} />;
  }

  const blocks = {
    banner,
  };

  const formConfig = {
    id: page.fields.slug[locale],
    label: "Blog Post",
    initialValues: page.fields,
    onSubmit: async (values) => {
      console.log("save values: ", values);
      cms.api.contentful
        .save(id, getCachedFormData(id).version, contentType, values)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          setCachedFormData(id, {
            version: data.sys.version,
          });
        });
    },
    fields: [
      {
        name: "title." + locale,
        label: "Post Title",
        component: "text",
      },
      {
        name: "fields." + locale + ".fields",
        label: "Fields",
        component: "blocks",
        templates: blocks,
      },
    ],
  };

  const [pageData, form] = useForm(formConfig);

  usePlugin(form);

  // const initialContent = useMemo(() => post.content, []);
  const fields = pageData.fields[locale].fields;

  return (
    <Layout preview={preview}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{pageData.title[locale]} | Next.js Blog Example</title>
              </Head>
              <h1>{pageData.title[locale]}</h1>
              {fields.map((field) => (
                <>
                  <BannerText
                    title={field.title}
                    subtitle={field.subtitle}
                    buttonText={field.buttonText}
                    onDownloadClick={() => alert("neat")}
                  />
                  <Collapsible />
                </>
              ))}
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  const slug = "blocks-demo";
  const pages = (
    await axios({
      url:
        `https://api.contentful.com/spaces/raftynxu3gyd/environments/master/entries?` +
        `access_token=${
          preview
            ? previewData.contentful_auth_token
            : process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
        }` +
        `&fields.slug[match]=${slug}` +
        `&content_type=blocksPage`,
      method: "GET",
    })
  ).data;

  if (pages.items.length != 1) {
    throw new Exception("Unique slug not found");
  }

  const page = pages.items[0];

  console.log("page", page.fields.fields);
  return {
    props: {
      page,
    },
  };
}
