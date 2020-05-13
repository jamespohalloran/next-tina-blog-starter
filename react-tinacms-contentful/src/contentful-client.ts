import Cookies from "js-cookie";
import popupWindow from "./popupWindow";

export const CONTENTFUL_AUTH_TOKEN = "contentful_auth_token";

export interface ContentfulClientOptions {
  clientId: string;
  redirectUrl: string;
}

export class ContentfulClient {
  clientId: string;
  redirectUrl: string;

  constructor({ clientId, redirectUrl }: ContentfulClientOptions) {
    this.clientId = clientId;
    this.redirectUrl = redirectUrl;
  }

  authenticate() {
    return new Promise((resolve) => {
      let authTab: Window | undefined;
      const url = `https://be.contentful.com/oauth/authorize?response_type=token&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}&scope=content_management_manage`;

      window.addEventListener("storage", function (e: StorageEvent) {
        Cookies.set(CONTENTFUL_AUTH_TOKEN, e.newValue, { sameSite: "strict" });
        authTab.close();
        resolve();
      });
      authTab = popupWindow(url, "_blank", window, 1000, 700);
    });
  }
}
