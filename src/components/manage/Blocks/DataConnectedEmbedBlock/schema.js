export function addLanguageParamField({ schema, intl }) {
  schema.fieldsets[0].fields.push('languageParam');
  schema.properties.languageParam = {
    title: 'Language parameter',
    description:
      'The name of the URL search parameter that will be added to the URL. The embedded URL should support ',
  };
  console.log(schema);
  return schema;
}
