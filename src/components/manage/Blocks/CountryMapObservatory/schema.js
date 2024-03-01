const Schema = () => {
  return {
    title: 'Country Map',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['href'],
      },
    ],
    properties: {
      href: {
        title: 'Countries folder',
        description:
          'The parent location of all country profiles. If empty, the current folder will be used as parent.',
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: [],
        allowExternals: true,
      },
    },
    required: [],
  };
};

export default Schema;
