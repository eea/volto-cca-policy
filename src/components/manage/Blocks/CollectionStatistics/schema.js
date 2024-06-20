import {
  hasNonValueOperation,
  hasDateOperation,
} from '@plone/volto/components/manage/Blocks/Search/utils';

const ExtraFilter = (_) => ({
  title: 'Extra Filters',
  fieldsets: [{ id: 'default', fields: ['id', 'value'], title: 'Default' }],
  properties: {
    id: {
      title: 'Field ID',
    },
    value: {
      title: 'Filter value',
    },
  },
  required: [],
});

const Schema = (formData) => {
  const isEEASearch = formData?.queryParameterStyle === 'EEASemanticSearch';

  return {
    title: 'Collection Statistics',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'aggregateField',
          'queryParameterStyle',
          'href',
          'showLabel',
          ...(isEEASearch ? ['extraFilters'] : []),
        ],
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
            ...Object.keys(options).map((k) => {
              const flag =
                Object.keys(options[k].values || {}).length ||
                hasNonValueOperation(options[k].operations) ||
                hasDateOperation(options[k].operations);
              return flag ? { [k]: options[k] } : {};
            }),
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
        default: 'SearchBlock',
      },
      showLabel: {
        type: 'boolean',
        title: 'Show label',
        default: false,
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
      extraFilters: {
        title: 'Extra filters',
        widget: 'object_list',
        schema: ExtraFilter({ formData }),
        // schemaExtender: (schema) => schema,
      },
    },
    required: [],
  };
};

export default Schema;
