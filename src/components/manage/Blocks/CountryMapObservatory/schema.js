const FilterSchema = (data) => {
  return {
    title: 'Country Map',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['display_mode', 'valid_countries'],
      },
    ],
    properties: {
      display_mode: {
        title: 'Display Mode',
        // description: 'Observatory/country map...',
        // choices: [
        //   ['cca', 'Climate Adapta'],
        //   ['observatory', 'Observatory'],
        // ],
      },
      valid_countries: {
        title: 'Valid country list',
        // description: 'List of countries',
      },
    },
    required: [],
  };
};

export default FilterSchema;
