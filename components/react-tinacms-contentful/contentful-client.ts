export class ContentfulClient {
  proxy: string;
  space: string;

  constructor(space: string, proxy: string) {
    this.space = space;
    this.proxy = proxy;
  }

  async save(id: string, version: string, contentModel: string, fields: any) {
    console.log("Saving entity: ", id, fields);
    return this.req({
      url: `https://api.contentful.com/spaces/${this.space}/environments/master/entries/${id}`,
      method: "PUT",
      headers: {
        "X-Contentful-Content-Type": contentModel,
        "X-Contentful-Version": version,
        "Content-Type": "application/vnd.contentful.management.v1+json",
      },
      data: {
        fields: fields,
      },
    });
  }

  async req(data: any) {
    const response = await this.proxyRequest(data);
    return response;
  }

  /**
   * The methods below maybe don't belong on GitHub client, but it's fine for now.
   */
  proxyRequest(data: any) {
    return fetch(this.proxy, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
