const Schema = () => {
  return {
    title: 'Redirect Block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['href'],
      },
    ],
    properties: {
      href: {
        title: 'Target',
        description: 'The target object for the redirection',
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
