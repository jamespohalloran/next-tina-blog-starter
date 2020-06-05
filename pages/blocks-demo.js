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
} from "@tinacms/react-tinacms-contentful";
import Collapsible from "../components/blocks/collapsible/Collapsible";
import banner from "../components/blocks/banner/BannerBlock";
import collapsible from "../components/blocks/collapsible/CollapsibleBlock";
import resolveResponse from "contentful-resolve-response";

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

  if (!router.isFallback && !page?.fields.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const blocks = {
    banner,
    collapsible,
  };

  const stripLinkedData = (fieldValue) => {
    if (fieldValue.sys?.contentType.sys.type || "" == "Link") {
      const { space, contentType, environment, ...sys } = fieldValue.sys;
      return { sys: { id: sys.id, type: "Link", linkType: "Entry" } };
    }
    return fieldValue;
  };

  const getLocalizedValues = (values) => {
    const localizedValues = {};
    Object.keys(values).forEach(function (key, index) {
      const fieldValue = values[key];

      if (Array.isArray(fieldValue)) {
        // TODO - this should check on links, not array
        localizedValues[key] = {
          [locale]: fieldValue.map((val) => {
            return stripLinkedData(val);
          }),
        };
      } else {
        localizedValues[key] = { [locale]: stripLinkedData(fieldValue) };
      }
    });
    return localizedValues;
  };

  const typedFields = (page.fields.typedFields || []).map((block) => {
    return {
      ...block,
      _template: block.sys.contentType.sys.id,
    };
  });

  const formConfig = {
    id: page.fields.slug,
    label: "Blog Post",
    initialValues: { ...page.fields, typedFields },
    onSubmit: async (values) => {
      const localizedValues = getLocalizedValues(values);

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

              {/* {fields.map((field) => (
                <>
                  {field._template == "banner" && (
                    <BannerText
                      title={field.title}
                      subtitle={field.subtitle}
                      buttonText={field.buttonText}
                      onDownloadClick={() => alert("neat")}
                    />
                  )}
                  {field._template == "collapsible" && (
                    <Collapsible panels={field.panels} />
                  )}
                </>
              ))} */}
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

  if (preview) {
    const managementPages = (
      await axios({
        url:
          `https://api.contentful.com/spaces/raftynxu3gyd/environments/master/entries?` +
          `access_token=${previewData.contentful_auth_token}` +
          `&fields.slug[match]=${slug}` +
          `&content_type=blocksPage`,
        method: "GET",
      })
    ).data;

    if (managementPages.items.length != 1) {
      throw new Exception("Unique slug not found");
    }

    page.sys.version = managementPages.items[0].sys.version;
  }

  return {
    props: {
      page,
    },
  };
}
