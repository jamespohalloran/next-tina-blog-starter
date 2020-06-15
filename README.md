# Next.js static blog starter + TinaCMS

This example project uses Next.js' [blog starter](https://next-blog-starter.now.sh/) and adds Tina to it according to the [Tina boostrapping guide](http://localhost:3001/guides/nextjs/adding-tina/overview).

## Contentful backend

This demo has been adapted to use Contentful as a backend, and uses the react-tinacms-contentful backend plugin.

## How to use

Install dependencies and run the example:

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)!

### .env

The .env will need to be filled out for this demo to work. See .env.example for sample values.

### Auth localhost workaround

Contentful's API will only redirect to https urls. This surfaces an issue when developing on localhost, and receiving an auth token through a contentful callback.
When authorizing locally, after the auth browser gets redirected to https://localhost:3000/contentful/authorizing?..., you can copy this url into a new tab as http instead of https

### Blocks demo

To view the blocks demo, visit the page: `http://localhost:3000/blocks-demo`.
Click "Edit this page" to enter edit-mode.
