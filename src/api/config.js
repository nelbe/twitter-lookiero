const config = {
  endpoints: {
    getUser: {
      url: 'account/user/',
      method: 'GET',
      jsonContent: true,
      authRequired: true,
    },
  },
};

export default config;

// With this part, you can create the content to the services server