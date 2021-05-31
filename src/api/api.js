import { useEffect, useMemo } from 'react';

import { ApiFetch } from './apiFetch';

// Global registry of response status events.
const RESPONSE_EVENTS = {};

// Register a callback to be called when a response is received with a specific HTTP status.
export const registerEvent = (status, callback) => {
  RESPONSE_EVENTS[status] = callback;
};

// Unregister a response event callback.
export const unregisterEvent = (status) => {
  if (status in RESPONSE_EVENTS) {
    delete RESPONSE_EVENTS[status];
  }
};

const REQUEST_FAILED = 'Request failed';

// Create an API error object
function createError(message, detail, response, fieldErrors = null) {
  // Check that the field errors is not an empty object
  if (fieldErrors && Object.keys(fieldErrors).length === 0) {
    fieldErrors = null;
  }

  return { message, detail, response, fieldErrors };
}

// Convert a snake case string to camel case
function camelize(text) {
  return text
    .split('_')
    .map((word, i) => (i ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join('');
}

// Convert all the properties in an object to camel case
function camelizeObject(o) {
  const entries = Object.entries(o).map(([name, value]) => [camelize(name), value]);
  return Object.fromEntries(entries);
}

// Parse DRF HTTP 400 responses into an error.
function parseDjangoRestFrameworkHttp400(response) {
  return response.json().then((body) => {
    const message = body['non_field_errors'] || body['detail'];

    // Create an object with the field errors by removing the DRF fields that are used
    // for general errors, and by changing field names to camel case.
    const fieldErrors = camelizeObject(body);
    delete fieldErrors['nonFieldErrors'];
    delete fieldErrors['detail'];

    // Create the error object
    const error = createError(message, body, response);

    // Add the field errors to the error object.
    // DRF returns a list of errors for each field, but only the first is added here.
    const entries = Object.entries(fieldErrors);
    if (entries.length) {
      error.fieldErrors = Object.fromEntries(entries.map(([name, values]) => [name, values[0]]));
    }

    // The HTTP 400 must result in an error
    return Promise.reject(error);
  });
}

// Parse DRF HTTP error responses into an error
function parseDjangoRestFrameworkGenericError(response) {
  // The HTTP 500 must result in an error
  return response.json().then((body) => Promise.reject(createError(body['detail'] || REQUEST_FAILED, body, response)));
}

// Make a request using a FetchApi instance.
const request = (api, endpoint, config, options = {}) => {
  let { params, body, headers } = options;

  if (body === undefined) {
    body = null;
  }

  if (params === undefined) {
    params = {};
  }

  if (headers === undefined) {
    headers = {};
  }

  return api
    .sendRequest(endpoint, params, body, headers)
    .catch((e) => {
      // Always log the error into the console
      console.error(e);
      // Fail with a generic API error
      return Promise.reject(createError(e.message || REQUEST_FAILED, e, e.response));
    })
    .then((response) => {
      const status = response.status;
      if (status in RESPONSE_EVENTS) {
        RESPONSE_EVENTS[status](response);
      }

      // Return and empty string for the HTTP 204 No Content responses
      if (status === 204) {
        return ['', response];
      }

      // Get the content type and check if the request is a JSON one
      const contentType = response.headers.get('Content-Type');
      const isJSON = contentType && contentType.startsWith('application/json');

      // Check if the fetch API got a successfull response from the server, and if so
      // parse the contents as JSON, text or file download.
      // Note: The fetch API sets the "response.ok" according to the response status.
      if (response.status === config.successReturnCode || response.ok) {
        if (config.fileContent === true) {
          // Read the file contents from the response when a file is being downloaded from the server
          return [response.blob(), response];
        } else {
          // By default return the response contents as JSON or text
          return [isJSON ? response.json() : response.text(), response];
        }
      }

      // When the server call returns with an error or an unexpected status treat it as an error
      if (isJSON) {
        switch (status) {
          case 400:
            return parseDjangoRestFrameworkHttp400(response);
          case 401:
          case 500:
            return parseDjangoRestFrameworkGenericError(response);
          default:
            // Get the JSON contents and use is to create the error
            return response.json().then((body) => {
              return Promise.reject(createError(body['detail'] || REQUEST_FAILED, body, response));
            });
        }
      } else {
        // When the response is not JSON create a generic API error
        return Promise.reject(createError(REQUEST_FAILED, response.statusText, response));
      }
    });
};

// API client.
//
// ApiClient wraps the API fetch functionality to expose the promises
// and also adds the endpoints defined in the config as methods.
//
// Ongoing requests can be aborted by calling the "abort()" method.
//
// Each endpoint function receives a single argument with the request options,
// where the supported options are:
//
//  - body: Contents of the request body.
//  - params: An object with the GET parameters.
//  - headers: An object with the request headers.
//
// Example:
//
//  // Import the API client factory
//  import { createApiClient } from '../helpers/apiFetch';
//
//  // Define the API config with the endpoints and any other generic options
//  const config = {
//    endpoints: {
//      listUsers: {
//        url: 'users/',
//        method: 'GET',
//        jsonContent: true
//      }
//    }
//  };
//
//  // Create the api client
//  const api = createApiClient(config);
//
//  // Get the users and list the email for each returned user
//  const options = { headers: { 'X-Example': 'Example Header Value' } };
//  api.listUsers(options).then((users) => {
//    users.forEach((user) => console.log(user.email));
//  });
//
//  // Create an api client that also returns the response
//  const anotherApi = createApiClient(config, { returnResponse: true });
//
//  // Get the users and list the email for each returned user, and log the response status
//  anotherApi.listUsers(options).then(([users, response]) => {
//    users.forEach((user) => console.log(user.email));
//    console.log(response.status);
//  });
//
//  // Create the api client with mock data
//  const mocks = { listUsers: [{ id: 1, name: 'Mocked' }] };
//  const mockedApi = createApiClient(config, { mocks });
//
//  // Mock the response
//  mockedApi.listUsers(options).then((users) => {
//    users.forEach((user) => console.log(user.email));
//  });
//
export const createApiClient = (config, options) => {
  const { mocks, returnResponse } = options || {};

  // Apply the mocked responses to the config
  if (mocks) {
    Object.entries(mocks).forEach(([name, mock]) => {
      if (name in config.endpoints) {
        config.endpoints[name].mockResponse = mock;
      }
    });
  }

  // Create the API instance
  const api = new ApiFetch(config);

  // Create an object containing a function for each endpoint defined in the config
  const client = Object.entries(config.endpoints).reduce((endpoints, [name, config]) => {
    endpoints[name] = (options) => {
      // When there is mock data for the endpoint use it
      if (endpoints[name].mockResponse) {
        const body = endpoints[name].mockResponse;
        return Promise.resolve(returnResponse ? [body, { status: 200 }] : body);
      }

      // Make the request and depending on the options return also the response
      return request(api, name, config, options || {}).then((args) => {
        const [body, response] = args;
        return returnResponse ? [body, response] : body;
      });
    };
    return endpoints;
  }, {});

  // Add a method to allow aborting ongoing requests
  client.abort = () => api.abort();

  return client;
};

// API hook.
//
// The hook wraps the API fetch functionality to expose the promises
// and also adds the endpoints defined in the config as methods.
// The fetch api instance can be accesed in the "apiFetch" property.
//
// Each endpoint function receives a single argument with the request options,
// where the supported options are:
//
//  - body: Contents of the request body.
//  - params: An object with the GET parameters.
//  - headers: An object with the request headers.
//
// Example:
//
//  // Import the API client factory
//  import { useApi } from '../api';
//
//  // Define the API config with the endpoints and any other generic options
//  const config = {
//    endpoints: {
//      listUsers: {
//        url: 'users/',
//        method: 'GET',
//        jsonContent: true
//      }
//    }
//  };
//
//  // Create the api client
//  const api = useApi(config);
//
//  // Get the users and list the email for each returned user
//  const options = { headers: { 'X-Example': 'Example Header Value' } };
//  api.listUsers(options).then((users) => {
//    users.forEach((user) => console.log(user.email));
//  });
//
export const useApi = (config, options) => {
  // Recreate the API instance only when the config changes
  // to avoid triggering the request abort effect.
  const api = useMemo(() => createApiClient(config, options), [config]);

  // Abort any ongoing request when components are unmounted
  useEffect(() => {
    return () => api.abort();
  }, [api]);

  return api;
};
