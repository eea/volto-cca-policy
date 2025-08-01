const fields = ['root_path', 'skip_items', 'show_subfolders'];

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
      title: 'Root path',
      type: 'string',
      description:
        'Ex: /en/knowledge-and-data/regional-adaptation-support-tool',
      required: true,
      noValueOption: false,
    },
    skip_items: {
      title: 'Exclude from image navigator',
      type: 'string',
      description: 'Ex: to skip first and third "0,2"',
      required: false,
      noValueOption: false,
    },
    show_subfolders: {
      title: 'Show subfolders',
      type: 'boolean',
      required: false,
      noValueOption: false,
    },
  },

  required: [],
};

export default schema;
