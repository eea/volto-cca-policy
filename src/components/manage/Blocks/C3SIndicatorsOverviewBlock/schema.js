const fields = ['category'];

const schema = {
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
      type: 'string',
      factory: 'Choice',
      choices: [
        ['health', 'Health'],
        ['agriculture', 'Agriculture'],
        ['forestry', 'Forestry'],
        ['energy', 'Energy'],
        ['tourism', 'Tourism'],
        ['water-and-coastal', 'Water and Coastal'],
      ],
      default: 'health',
      description: 'Choose indicators category to be used as filter.',
      required: true,
      noValueOption: false,
    },
  },

  required: [],
};

export default schema;
