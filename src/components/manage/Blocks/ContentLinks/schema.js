const Item = () => ({
  title: 'Item',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['source', 'item_title'],
    },
  ],
  properties: {
    source: {
      widget: 'object_browser',
      mode: 'link',
      title: 'Source',
      description: 'Choose an existing content as source',
    },
    item_title: {
      type: 'string',
      title: 'Title',
    },
  },

  required: ['title'],
});

const schema = {
  title: 'Content links',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'items'],
    },
  ],
  properties: {
    items: {
      widget: 'object_list',
      title: 'Items',
      description: 'Add a list of items',
      schema: Item(),
    },
    title: {
      title: 'Block title',
    },
  },
  required: [],
};

export default schema;
