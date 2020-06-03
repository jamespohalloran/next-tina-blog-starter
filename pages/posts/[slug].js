import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import PostTitle from "../../components/post-title";
import Head from "next/head";
import { CMS_NAME } from "../../lib/constants";
import markdownToHtml from "../../lib/markdownToHtml";
import { useState, useEffect } from "react";
import { useForm, usePlugin, useCMS } from "tinacms";

import {
  getCachedFormData,
  setCachedFormData,
} from "../../react-tinacms-contentful/cachedFormData";

import Box from "@tds/core-box";
import Button from "@tds/core-button";
import DisplayHeading from "@tds/core-display-heading";
import Paragraph from "@tds/core-paragraph";
import { createClient } from "contentful-management";

const axios = require("axios");

const client = require("contentful").createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
});

export default function Post({ post: initialPost, morePosts, preview, der }) {
  const router = useRouter();
  const cms = useCMS();

  const locale = "en-US";

  const id = initialPost.sys.id;
  const contentType = initialPost.sys.contentType.sys.id;

  useEffect(() => {
    setCachedFormData(id, {
      version: initialPost.sys.version,
    });
  }, []);

  if (!router.isFallback && !initialPost?.fields.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const formConfig = {
    id: initialPost.fields.slug,
    label: "Blog Post",
    initialValues: initialPost.fields,
    onSubmit: async (values) => {
      Object.keys(values).map((key) => {
        if (values[key].sys) {
          initialPost.managementPost.fields[key]["en-US"].sys.id =
            values[key].sys.id;
        } else {
          initialPost.managementPost.fields[key]["en-US"] = values[key];
        }
      });

      cms.api.contentful
        .save(
          id,
          initialPost.managementPost.sys.version,
          contentType,
          initialPost.managementPost.fields
        )
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
      {
        name: "body",
        label: "Content",
        component: "markdown",
      },
      {
        name: "author",
        label: "author",
        component: "contentful-linked-field",
        parse: (value) => JSON.parse(value),
        getOptions,
      },
    ],
  };

  const [post, form] = useForm(formConfig);
  usePlugin(form);

  const [htmlContent, setHtmlContent] = useState(post.content);
  // const initialContent = useMemo(() => post.content, []);
  useEffect(() => {
    markdownToHtml(post.body).then(setHtmlContent);
  }, [post.body]);

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage?.url || ""} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <BannerText onDownloadClick={() => alert("neat")} />

              <PostBody content={htmlContent} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

const BannerText = ({ onDownloadClick }) => (
  <Box between={5}>
    <DisplayHeading>
      Pay your bills and monitor internet usage on the go
    </DisplayHeading>
    <Paragraph>Download the new and improved My Account app today.</Paragraph>

    <div>
      <Button onClick={onDownloadClick}>Download now</Button>
    </div>
  </Box>
);

async function getOptions() {
  return await client.getEntries({ content_type: "person" });
}

const getLocalizedValues = (values) => {
  const localizedValues = {};
  Object.keys(values).forEach(function (key, index) {
    localizedValues[key] = { "en-US": values[key] };
  });
  return localizedValues;
};

export async function getStaticProps({ params, preview, previewData }) {
  let post = await getPost(preview, params);
  const content = await markdownToHtml(post.fields.body || "");

  const managementClient = createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  });
  const managementPost = await managementClient
    .getSpace("raftynxu3gyd")
    .then((space) => space.getEnvironment("master"))
    .then((environment) => environment.getEntry(post.sys.id));

  post.sys.version = managementPost.sys.version;
  post.managementPost = managementPost.toPlainObject();

  return {
    props: {
      post,
      content,
      rawMarkdownBody: post.fields.body,
    },
  };
}

async function getPost(preview, params) {
  const posts = await client.getEntries({
    content_type: "blogPost",
    "fields.slug[match]": params.slug,
  });
  if (posts.items.length != 1) {
    throw new Exception("Unique slug not found on post");
  }
  const post = posts.items[0];
  return post;
}

export async function getStaticPaths() {
  // Now that we have a space, we can get entries from that space
  const entries = await client.getEntries({
    content_type: "blogPost",
    include: 10,
  });

  return {
    paths: entries.items.map(({ fields }) => {
      return {
        params: {
          slug: fields.slug,
        },
      };
    }),
    fallback: false,
  };
}
