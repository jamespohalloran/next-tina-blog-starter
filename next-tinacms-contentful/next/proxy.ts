const axios = require("axios");

export const proxy = (req: any, res: any) => {
  const { headers, ...data } = JSON.parse(req.body);

  const authToken = data.url.includes("api.contentful.com")
    ? process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
    : process.env.CONTENTFUL_PREVIEW_API_TOKEN;
  axios({
    ...data,
    headers: {
      ...headers,
      Authorization: "Bearer " + authToken,
    },
  })
    .then((resp: any) => {
      res.status(resp.status).json(resp.data);
    })
    .catch((err: any) => {
      res.status(err.response.status).json(err.response.data);
    });
};
