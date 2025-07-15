export default {
  title: 'Flourish visualization block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['embed_code'],
    },
  ],
  properties: {
    embed_code: {
      title: 'Flourish embed code',
      widget: 'textarea',
    },
  },
  required: [],
};
