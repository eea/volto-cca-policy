const schema = {
  title: 'Search Ace Content',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'title',
        'search_text',
        'origin_website',
        'search_type',
        'element_type',
        'sector',
        'special_tags',
        'countries',
        'macro_regions',
        'bio_regions',
        'funding_programme',
        'nr_items',
      ],
    },
  ],
  properties: {
    title: {
      title: 'Block title',
    },
    search_text: {
      title: 'Search text',
    },
    origin_website: {
      title: 'Origin website',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.origin_website',
      },
    },
    search_type: {
      title: 'Aceitem type',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.search_types_vocabulary',
      },
    },
    element_type: {
      title: 'Adaptation approach',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.element_types_vocabulary',
      },
    },
    sector: {
      title: 'Sector',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.aceitems_sectors',
      },
    },
    special_tags: {
      title: 'Special tags',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.special_tags',
      },
    },
    countries: {
      title: 'Countries',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.ace_countries',
      },
    },
    macro_regions: {
      title: 'Macro-Transnational Regions',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.regions',
      },
    },
    bio_regions: {
      title: 'Biogeographical Regions',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.bioregions',
      },
    },
    funding_programme: {
      title: 'Funding programmes',
      type: 'choice',
      vocabulary: {
        '@id': 'eea.climateadapt.funding_programme',
      },
    },
    nr_items: {
      title: 'Nr of items to show',
      type: 'number',
      default: '5',
    },
  },
  required: [],
};

export default schema;
