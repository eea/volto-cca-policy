export default {
  title: 'Trans Region Select',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'region'],
    },
  ],
  properties: {
    title: {
      title: 'Block title',
    },
    region: {
      title: 'Region',
      vocabulary: {
        '@id': 'eea.climateadapt.regions',
      },
    },
  },
  required: [],
};
