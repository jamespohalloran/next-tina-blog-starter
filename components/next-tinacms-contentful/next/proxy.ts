import { CONTENTFUL_AUTH_TOKEN } from "../../react-tinacms-contentful/contentful-client";

const axios = require("axios");

export const proxy = (req: any, res: any) => {
  const { headers, ...data } = JSON.parse(req.body);

  axios({
    ...data,
    headers: {
      ...headers,
      Authorization: "Bearer " + req.cookies[CONTENTFUL_AUTH_TOKEN],
    },
  })
    .then((resp: any) => {
      res.status(resp.status).json(resp.data);
    })
    .catch((err: any) => {
      res.status(err.response.status).json(err.response.data);
    });
};
