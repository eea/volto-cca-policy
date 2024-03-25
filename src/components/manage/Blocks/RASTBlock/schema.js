const fields = ['root_path', 'skip_items'];

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
    root_path: {
      title: 'Rooth path',
      type: 'string',
      description:
        'Ex: /en/knowledge-and-data/regional-adaptation-support-tool',
      required: true,
      noValueOption: false,
    },
    skip_items: {
      title: 'Skip items list',
      type: 'string',
      description: 'Ex: to skip first and third "0,2"',
      required: false,
      noValueOption: false,
    },
  },

  required: [],
};
