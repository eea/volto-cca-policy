const Item = () => ({
  title: 'Item',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['href', 'title'],
    },
  ],
  properties: {
    href: {
      widget: 'object_browser',
      mode: 'link',
      title: 'Source',
      description: 'Choose an existing content as source',
    },
    title: {
      type: 'string',
      title: 'Title',
      description: 'Overrides the source title',
    },
  },

  required: ['href'],
});

export default {
  title: 'AST Navigation',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'image_type', 'items'],
    },
  ],
  properties: {
    items: {
      widget: 'object_list',
      title: 'Items',
      description: 'Pick one item for each navigation step',
      schema: Item(),
    },
    image_type: {
      title: 'Image type',
      choices: [
        ['ast', 'AST'],
        ['uast', 'UAST'],
      ],
      default: 'ast',
    },
    title: {
      title: 'Block title',
    },
  },
  required: [],
};
