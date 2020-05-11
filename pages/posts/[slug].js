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
import { useState, useEffect, useMemo } from "react";
import { useForm, usePlugin, useCMS } from "tinacms";

const axios = require("axios");

const client = require("contentful").createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
});

export default function Post({ post: initialPost, morePosts, preview }) {
  const router = useRouter();
  const cms = useCMS();

  const locale = "en-US";

  if (!router.isFallback && !initialPost?.fields.slug[locale]) {
    return <ErrorPage statusCode={404} />;
  }

  const id = initialPost.sys.id;
  const contentType = initialPost.sys.contentType.sys.id;

  const version = initialPost.sys.version;

  const formConfig = {
    id: initialPost.fields.slug[locale],
    label: "Blog Post",
    initialValues: initialPost.fields,
    onSubmit: (values) => {
      cms.api.contentful.save(id, version, contentType, values);
    },
    fields: [
      {
        name: "title." + locale,
        label: "Post Title",
        component: "text",
      },
      {
        name: "rawMarkdownBody",
        label: "Content",
        component: "markdown",
      },
    ],
  };

  const [post, form] = useForm(formConfig);
  usePlugin(form);

  const [htmlContent, setHtmlContent] = useState(post.content);
  const initialContent = useMemo(() => post.rawMarkdownBody, []);
  useEffect(() => {
    if (initialContent == post.rawMarkdownBody) return;
    markdownToHtml(post.rawMarkdownBody).then(setHtmlContent);
  }, [post.rawMarkdownBody]);

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
                  {post.title[locale]} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage?.url || ""} />
              </Head>
              <PostHeader
                title={post.title[locale]}
                coverImage={post.coverImage}
                date={post.date[locale]}
                author={post.author[locale]}
              />
              <PostBody content={htmlContent} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const posts = (
    await axios({
      url:
        `https://api.contentful.com/spaces/raftynxu3gyd/environments/master/entries?` +
        `access_token=${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN}` +
        `&fields.slug[match]=${params.slug}` +
        `&content_type=blogPost`,
      method: "GET",
    })
  ).data;

  if (posts.items.length != 1) {
    throw new Exception("Unique slug not found on post");
  }

  const post = posts.items[0];

  // TODO - these are the fields used by out layout
  // We no longer an map them here, as we will want to save them all out
  // in original format

  // const fields = {
  //   title: post.fields.title["en-US"],
  //   date: post.fields.publishDate["en-US"],
  //   slug: post.fields.slug["en-US"],
  //   author: {
  //     name: "Johnny",
  //     image: {
  //       fields: {
  //         file: { url: "" },
  //       },
  //     },
  //   }, //linkedPostData.fields.author.fields,
  //   coverImage: "", //linkedPostData.fields.heroImage?.fields.file.url || "",
  //   ogImage: "", //linkedPostData.fields.heroImage?.fields.file.url || "",
  // };

  const content = await markdownToHtml(post.fields.body || "");

  return {
    props: {
      post,
      content,
      rawMarkdownBody: post.fields.body["en-US"],
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
