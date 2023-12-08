const fields = ['top_level'];

export default {
  title: 'RAST',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields,
    },
  ],

  properties: {
    top_level: {
      title: 'Top Level',
      type: 'string',
      description: 'Ex 2 for /en/about/rast',
      required: true,
      noValueOption: false,
    },
  },

  required: [],
};
