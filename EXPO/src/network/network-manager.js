import { Headers } from "./api-header-constant";

export default class NetworkManager {
  static requestGET(url) {
    return fetch(url);
  }

  static requestPOST(url, body, headers = Headers) {
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });
  }

  static requestHEAD(url) {
    return fetch(url, {
      method: "HEAD"
    });
  }
}
