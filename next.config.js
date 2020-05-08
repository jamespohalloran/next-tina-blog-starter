require("dotenv").config();

module.exports = {
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_DELIVERY_ACCESS_TOKEN:
      process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN,
  },
};
