const fields = ['root_path'];

const schema = {
  title: 'RAST',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields,
    },
  ],

  properties: {
    root_path: {
      title: 'Rooth path',
      type: 'string',
      description:
        'Ex: /en/knowledge-and-data/regional-adaptation-support-tool',
      required: true,
      noValueOption: false,
    },
  },

  required: [],
};

export default schema;
