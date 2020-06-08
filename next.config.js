require("dotenv").config();
const path = require("path");

const tinaWebpackHelpers = require("@tinacms/webpack-helpers");

module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.resolve.alias["@tinacms/react-tinacms-contentful"] = path.resolve(
        "../react-tinacms-contentful"
      );
      config.resolve.alias["react-beautiful-dnd"] = path.resolve(
        "./node_modules/react-beautiful-dnd"
      );

      tinaWebpackHelpers.aliasTinaDev(config, "../tinacms");
    }

    return config;
  },
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_DELIVERY_ACCESS_TOKEN:
      process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
    CONTENTFUL_CLIENT_ID: process.env.CONTENTFUL_CLIENT_ID,
    CONTENTFUL_AUTH_REDIRECT_URL: process.env.CONTENTFUL_AUTH_REDIRECT_URL,
  },
};
