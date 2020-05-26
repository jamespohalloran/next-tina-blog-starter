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
} from "../../components/react-tinacms-contentful/cachedFormData";

const axios = require("axios");

const client = require("contentful").createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
});

export default function Post({ post: initialPost, morePosts, preview }) {
  const router = useRouter();
  const cms = useCMS();

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
      console.log(values);
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
      {
        name: "body",
        label: "Content",
        component: "markdown",
      },
      {
        name: "author.sys.id",
        label: "Author",
        component: "contentful-linked-field",
        getOptions, // a function used to get the available options for the field
        initDisplay: initialPost.fields.author.fields.name,
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

  const [author, setAuthor] = useState(post.author);
  useEffect(() => {
    getAuthorInfo(post.author.sys.id).then(setAuthor);
  }, [post.author.sys.id]);

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
                coverImage={post.heroImage}
                date={post.date}
                author={author}
              />
              <PostBody content={htmlContent} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

async function getAuthorInfo(authorId) {
  return await client.getEntry(authorId);
}

async function getOptions(contentType) {
  return await client.getEntries({ content_type: contentType });
}
const getLocalizedValues = (values) => {
  const localizedValues = {};
  Object.keys(values).forEach(function (key, index) {
    localizedValues[key] = { "en-US": values[key] };
  });
  return localizedValues;
};

export async function getStaticProps({ params, preview, previewData }) {
  const posts = await client.getEntries({
    content_type: "blogPost",
    "fields.slug[match]": params.slug,
  });

  if (posts.items.length != 1) {
    throw new Exception("Unique slug not found on post");
  }

  let post = posts.items[0];

  if (preview) {
    const managementPosts = (
      await axios({
        url:
          `https://api.contentful.com/spaces/raftynxu3gyd/environments/master/entries?` +
          `access_token=${previewData.contentful_auth_token}` +
          `&fields.slug[match]=${params.slug}` +
          `&content_type=blogPost`,
        method: "GET",
      })
    ).data;

    if (managementPosts.items.length != 1) {
      throw new Exception("Unique slug not found");
    }

    post.sys.version = managementPosts.items[0].sys.version;
  }

  const content = await markdownToHtml(post.fields.body || "");

  return {
    props: {
      post,
      content,
      rawMarkdownBody: post.fields.body,
    },
  };
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
