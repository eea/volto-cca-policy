const fields = ['category'];

export default {
  title: 'C3S Indicators Overview',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields,
    },
  ],

  properties: {
    category: {
      title: 'Category',
      widget: 'object_browser',
      mode: 'link',
    },
  },

  required: [],
};
