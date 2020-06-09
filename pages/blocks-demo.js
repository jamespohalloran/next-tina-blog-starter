import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../components/container";
import Layout from "../components/layout";
import PostTitle from "../components/post-title";
import Head from "next/head";
import { useForm, usePlugin, useCMS } from "tinacms";
import BannerText from "../components/blocks/banner/Banner";
import {
  getCachedFormData,
  setCachedFormData,
  mapLocalizedValues,
} from "@tinacms/react-tinacms-contentful";
import Collapsible from "../components/blocks/collapsible/Collapsible";
import banner from "../components/blocks/banner/BannerBlock";
import collapsible from "../components/blocks/collapsible/CollapsibleBlock";
import resolveResponse from "contentful-resolve-response";

const axios = require("axios");

export default function Post({ page, preview }) {
  const router = useRouter();
  const cms = useCMS();

  const id = page.sys.id;
  const contentType = page.sys.contentType.sys.id;

  if (!router.isFallback && !page?.fields.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const blocks = {
    banner,
    collapsible,
  };

  const loadInitialValues = async () => {
    const entry = await cms.api.contentful.fetchFullEntry(page.sys.id);

    // TODO - we should do this mapping in a Contentful linked-block field
    const typedFields = (entry.fields.typedFields || []).map((block) => {
      return {
        ...block,
        _template: block.sys.contentType.sys.id,
      };
    });

    setCachedFormData(id, {
      version: entry.sys.version,
    });

    return {
      ...entry.fields,
      typedFields,
    };
  };

  const formConfig = {
    id: page.fields.slug,
    label: "Blog Post",
    loadInitialValues,
    onSubmit: async (values) => {
      const localizedValues = mapLocalizedValues(values, "en-US");

      cms.api.contentful
        .save(id, getCachedFormData(id).version, contentType, localizedValues)
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
        name: "title",
        label: "Post Title",
        component: "text",
      },
      // {
      //   name: "fields" + ".fields",
      //   label: "Fields",
      //   component: "blocks",
      //   templates: blocks,
      // },
      {
        name: "typedFields",
        label: "Typed Fields",
        component: "linked-blocks",
        templates: blocks,
      },
    ],
  };

  const [pageData, form] = useForm(formConfig);

  usePlugin(form);

  if (Object.keys(pageData).length === 0) {
    return null;
  }

  return (
    <Layout preview={preview}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{pageData.title} | Next.js Blog Example</title>
              </Head>
              <h1>{pageData.title}</h1>
              {pageData.typedFields.map((block) => {
                const fieldType = block.sys.contentType.sys.id;
                return (
                  <>
                    {fieldType == "banner" && (
                      <BannerText
                        title={block.fields.title}
                        subtitle={block.fields.subtitle}
                        buttonText={block.fields.buttonText}
                        onDownloadClick={() => alert("neat")}
                      />
                    )}
                    {fieldType == "collapsible" && (
                      <Collapsible panels={block.fields.panels} />
                    )}
                  </>
                );
              })}
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  const slug = "blocks-demo4";

  const pages = (
    await axios({
      url:
        `https://${
          preview ? "preview" : "cdn"
        }.contentful.com/spaces/raftynxu3gyd/environments/master/entries?` +
        `access_token=${
          preview
            ? process.env.CONTENTFUL_PREVIEW_API_TOKEN
            : process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN
        }` +
        `&fields.slug[match]=${slug}` +
        `&include=10` +
        `&content_type=blocksPage`,
      method: "GET",
    })
  ).data;

  const resolvedPages = resolveResponse(pages, {
    removeUnresolved: true,
    itemEntryPoints: ["fields"],
  });

  if (resolvedPages.length != 1) {
    throw new Exception("Unique slug not found");
  }

  let page = resolvedPages[0];

  return {
    props: {
      page,
      preview: !!preview,
    },
  };
}
