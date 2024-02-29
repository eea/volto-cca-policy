import {
  hasNonValueOperation,
  hasDateOperation,
} from '@plone/volto/components/manage/Blocks/Search/utils';

const Schema = () => {
  return {
    title: 'Collection Statistics',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['aggregateField', 'queryParameterStyle', 'href'],
      },
      {
        id: 'query',
        title: 'Query',
        fields: ['query'],
      },
    ],
    properties: {
      query: {
        title: 'Query',
        widget: 'query',
      },
      aggregateField: {
        title: 'Aggregate Field',
        widget: 'select_querystring_field',
        vocabulary: { '@id': 'plone.app.vocabularies.MetadataFields' },
        filterOptions: (options) => {
          // Only allows indexes that provide simple, fixed vocabularies.
          // This should be improved, together with the facets. The querystring
          // widget implementation should serve as inspiration for those dynamic
          // types of facets.
          return Object.assign(
            {},
            ...Object.keys(options).map((k) =>
              Object.keys(options[k].values || {}).length ||
              hasNonValueOperation(options[k].operations) ||
              hasDateOperation(options[k].operations)
                ? { [k]: options[k] }
                : {},
            ),
          );
        },
      },
      queryParameterStyle: {
        title: 'Query parameters syle',
        description: 'The destination listing page type',
        choices: [
          ['SearchBlock', 'Volto Search block'],
          ['EEASemanticSearch', 'EEA Semantic Search'],
        ],
        default: 'ListingBlock',
      },

      href: {
        title: 'Listing page',
        description:
          'The destination listing page. If empty, the current folder will be used.',
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
