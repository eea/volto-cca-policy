export default {
  title: 'Search Ace Content',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['origin_website', 'sector', 'funding_programme'],
    },
  ],
  properties: {
    origin_website: {
      title: 'Origin website',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.funding_programme',
      },
    },

    sector: {
      title: 'Sector',
      widget: 'array',
      vocabulary: {
        '@id': 'eea.climateadapt.aceitems_sectors',
      },
    },

    funding_programme: {
      title: 'Funding programmes',
      type: 'choice',
      vocabulary: {
        '@id': 'eea.climateadapt.funding_programme',
      },
    },
  },
  required: [],
};

/*

    sector = List(
        title=u"Sector",
        required=False,
        value_type=Choice(
            vocabulary="eea.climateadapt.aceitems_sectors",
        ),
    )

    funding_programme = Choice(
        vocabulary="eea.climateadapt.funding_programme",
        title=u"Funding programmes",
        required=False,
    )

    origin_website = List(
        title=u"Origin website",
        required=False,
        value_type=Choice(
            vocabulary='eea.climateadapt.origin_website'
        ),
    )
    */
