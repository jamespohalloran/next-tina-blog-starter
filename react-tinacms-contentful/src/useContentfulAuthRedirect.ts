import { useEffect } from "react";
import { CONTENTFUL_AUTH_TOKEN } from "./contentful-client";
import Cookies from "js-cookie";

export const useContentfulAuthRedirect = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash);
    const code = urlParams.get("#access_token");
    Cookies.set(CONTENTFUL_AUTH_TOKEN, code, { sameSite: "strict" });
  }, []);
};
