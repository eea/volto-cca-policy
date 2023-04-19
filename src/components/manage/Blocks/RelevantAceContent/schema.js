const Item = () => ({
  title: 'Item',
  fieldsets: [
    {
      id: 'content',
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
  title: 'Relevant Ace Content',
  fieldsets: [
    {
      id: 'query',
      title: 'Query',
      fields: [
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
        'show_share_btn',
        'combine_results',
        'sortBy',
      ],
    },
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
    search_text: {
      title: 'Search text',
    },
    origin_website: {
      title: 'Origin website',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.funding_programme',
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
      title: 'Element type',
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
      default: '0',
    },
    show_share_btn: {
      title: 'Show the share button',
      type: 'boolean',
    },
    combine_results: {
      title: 'Show listing results, in addition to assigned items',
      type: 'boolean',
    },
    sortBy: {
      title: 'Sort order for results and assigned items',
      vocabulary: {
        '@id': 'sortby_vocabulary',
      },
    },
  },
  required: [],
};
