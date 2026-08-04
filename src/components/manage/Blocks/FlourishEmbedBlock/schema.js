const schema = {
  title: 'Flourish visualization block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['embed_code', 'height'],
    },
  ],
  properties: {
    embed_code: {
      title: 'Flourish embed code',
      widget: 'textarea',
    },
    height: {
      title: 'Embed height',
      description:
        'Height of the Flourish iframe in pixels. If left empty, the default height is 980 px.',
      type: 'number',
    },
  },
  required: [],
};

export default schema;
