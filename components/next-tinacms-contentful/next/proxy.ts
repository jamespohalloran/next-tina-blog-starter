const axios = require("axios");

export const proxy = (req, res) => {
  const { headers, ...data } = JSON.parse(req.body);

  axios({
    ...data,
    headers: {
      ...headers,
      Authorization: "Bearer " + process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    },
  })
    .then((resp) => {
      res.status(resp.status).json(resp.data);
    })
    .catch((err) => {
      res.status(err.response.status).json(err.response.data);
    });
};
