export class ApiFetch {
  constructor(config) {
      this.config = config;
      this.parseConfig();
      // Add a controller to support aborting ongoing request
      // See: https://caniuse.com/abortcontroller
    this.controller = new AbortController();
  }

  parseConfig() {
      if (this.config) {
          let { rootURL, apiURLPrefix, authorizationPrefix } = this.config;
      }
      // Here is possible config the basePrefix to call the endpoints
  }

  renderURL(url, params) {
      // Here render the URL
  }

  buildHeaders(customHeaders, config) {
    // Here build the headers
    const headers = { ...customHeaders };

    if (config.jsonContent) {
      headers['Content-Type'] = 'application/json';
    }

    if (config.fileContent) {
      headers['Accept'] = '*/*';
    }

    return headers;
  }

  sendRequest(endpoint, params = {}, body = null, customHeaders = {}) {
   // Here create a request
  }

  getResponse(endpoint, callback, params = {}, body = null, customHeaders = {}) {
    // It doesn't work because you need the parts from before (not implemented because they are not needed in this project)
    // With the parts before and this part (getResponse) you can handle requests to the server
    if (endpoint.mockResponse) {
      return callback(endpoint.mockResponse, null);
    }

    const config = this.endpoints[endpoint];
    this.sendRequest(endpoint, params, body, customHeaders)
      .then((r) => {
        if (r.status === config.successReturnCode) {
          if (config.fileContent) {
            r.blob().then((response) => callback(response, null));
          } else {
            // NOTE: The response text must be read in order for the callback to be
            //       called for no content responses for a JSON request.
            if (config.jsonContent === false || Number(r.status) === 204) {
              r.text().then((response) => callback(response, null));
            } else {
              r.json().then((response) => callback(response, null));
            }
          }
        } else if (Number(r.status) === 405) {
          r.json().then((response) => callback(null, response));
        } else {
          return callback(null, { status: r.status, error: r.statusText });
        }
      })
      .catch((e) => {
        return callback(null, { status: 500, error: 'Internal Server Error', errorObject: e });
      });
  }

  // Abort the ongoing request
  abort() {
    this.controller.abort();
  }
}
