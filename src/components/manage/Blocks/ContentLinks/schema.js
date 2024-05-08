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

export default {
  title: 'Content links',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'items', 'show_share_btn'],
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
    show_share_btn: {
      title: 'Show the share button',
      type: 'boolean',
    },
  },
  required: [],
};
