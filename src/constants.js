export const download_fields = [
  // { field: 'cca_uid', name: 'UID' },
  { field: 'about', name: 'About' },
  { field: 'title', name: 'Title' },
  { field: 'created', name: 'Creation Date' },
  { field: 'issued', name: 'Issued Date' },
  { field: 'publication_date', name: 'Publication Date' },
  { field: 'creators', name: 'Creator' },
  { field: 'objectProvides', name: 'Content type' },
  { field: 'fulltext', name: 'Description' },
  { field: 'cca_keywords', name: 'Keywords' },
  { field: 'cca_adaptation_sectors', name: 'Sectors' },
  { field: 'cca_climate_impacts', name: 'Climate impact' },
  { field: 'transnational_regions', name: 'Transnational regions' },
  { field: 'cca_adaptation_elements', name: 'Adaptation Approaches' },
  { field: 'cca_funding_programme', name: 'Funding programme' },
  { field: 'cca_key_type_measure', name: 'Key type measure' },
  { field: 'cca_geographic_countries', name: 'Countries' },
  { field: 'cca_origin_websites', name: 'Origin website' },
  { field: 'cca_health_impacts', name: 'Health impacts' },
  { field: 'cca_partner_contributors', name: 'Observatory impacts' },
];

export const download_mission_funding_fields = [
  { field: 'about', name: 'About' },
  { field: 'title', name: 'Title' },
  { field: 'created', name: 'Creation Date' },
  { field: 'issued', name: 'Issued Date' },
  {
    field: 'cca_objective_funding_programme',
    name: 'Objective of the funding programme',
  },
  {
    field: 'cca_funding_type',
    name: 'Type of funding',
  },
  {
    field: 'cca_funding_rate',
    name: 'Funding rate (percentage of covered costs)',
  },
  {
    field: 'cca_budget_range',
    name: 'Expected budget range of proposals',
  },
  {
    field: 'cca_is_blended',
    name: 'Can the received funding be combined with other funding sources (blended)?',
  },
  {
    field: 'cca_is_consortium_required',
    name: 'Is a Consortium required to apply for the funding?',
  },
  {
    field: 'cca_administering_authority',
    name: 'Administering authority',
  },
  {
    field: 'cca_publication_page',
    name: 'Publication page',
  },
  {
    field: 'cca_general_information',
    name: 'General information',
  },
  {
    field: 'cca_further_information',
    name: 'Further information',
  },
  {
    field: 'spatial',
    name: 'Countries where the funding opportunity is offered',
  },
  {
    field: 'cca_funding_region',
    name: 'Region where the funding is offered',
  },
  {
    field: 'cca_rast_steps',
    name: 'RAST step(s) of relevance',
  },
  {
    field: 'cca_eligible_entities',
    name: 'Eligible to receive funding',
  },
  {
    field: 'cca_adaptation_sectors',
    name: 'Adaptation Sectors',
  },
];

// Download fields for mission content types
// Don't delete - might be needed later (ticket refs #295149)
// export const download_mission_stories_fields = [
//   { field: 'about', name: 'About' },
//   { field: 'title', name: 'Title' },
//   { field: 'main_content', name: 'Content' },
//   { field: 'created', name: 'Creation Date' },
//   { field: 'issued', name: 'Issued Date' },
//   { field: 'cca_climate_impacts', name: 'Climate impact' },
//   { field: 'cca_adaptation_sectors', name: 'Sectors' },
//   { field: 'key_system', name: 'Key Community Systems' },
//   { field: 'cca_funding_programme', name: 'Funding programme' },
//   {
//     field: 'spatial',
//     name: 'Countries ',
//   },
//   { field: 'cca_keywords', name: 'Keywords' },
// ];

// export const download_mission_projects_fields = [
//   { field: 'about', name: 'About' },
//   { field: 'title', name: 'Title' },
//   { field: 'main_content', name: 'Content' },
//   { field: 'created', name: 'Creation Date' },
//   { field: 'issued', name: 'Issued Date' },
//   { field: 'cca_keywords', name: 'Keywords' },
//   { field: 'cca_funding_programme', name: 'Funding Programme' },
//   { field: 'cca_climate_impacts', name: 'Climate impact' },
//   { field: 'cca_adaptation_elements', name: 'Adaptation Approaches' },
//   { field: 'cca_adaptation_sectors', name: 'Sectors' },
//   { field: 'cca_geographic_countries', name: 'Countries' },
// ];

// export const download_mission_tools_fields = [
//   { field: 'about', name: 'About' },
//   { field: 'title', name: 'Title' },
//   { field: 'main_content', name: 'Content' },
//   { field: 'created', name: 'Creation Date' },
//   { field: 'issued', name: 'Issued Date' },
//   { field: 'cca_rast_steps', name: 'RAST step(s) of relevance' },
//   { field: 'cca_geographical_scale', name: 'Geographical scale' },
//   { field: 'cca_climate_impacts', name: 'Climate impact' },
//   { field: 'cca_tool_language', name: 'Language(s) of the tool' },
//   { field: 'cca_adaptation_sectors', name: 'Sectors' },
//   { field: 'cca_most_useful_for', name: 'Most useful for' },
//   { field: 'cca_user_requirements', name: 'User requirements' },
// ];

export const supported_languages = [
  { name: 'български', code: 'bg' },
  { name: 'Español', code: 'es' },
  { name: 'Čeština', code: 'cs' },
  { name: 'Dansk', code: 'da' },
  { name: 'Deutsch', code: 'de' },
  { name: 'Eesti keel', code: 'et' },
  { name: 'Ελληνικά', code: 'el' },
  { name: 'English', code: 'en' },
  { name: 'Français', code: 'fr' },
  { name: 'Gaeilge', code: 'ga' },
  { name: 'Hrvatski', code: 'hr' },
  { name: 'Italiano', code: 'it' },
  { name: 'Latviešu', code: 'lv' },
  { name: 'Lietuvių', code: 'lt' },
  { name: 'Magyar', code: 'hu' },
  { name: 'Malti', code: 'mt' },
  { name: 'Nederlands', code: 'nl' },
  { name: 'Polski', code: 'pl' },
  { name: 'Português', code: 'pt' },
  { name: 'Română', code: 'ro' },
  { name: 'Slovenčina', code: 'sk' },
  { name: 'Slovenščina', code: 'sl' },
  { name: 'Suomi', code: 'fi' },
  { name: 'Svenska', code: 'sv' },
  { name: 'Íslenska', code: 'is' },
  { name: 'Nynorsk', code: 'nn' },
  { name: 'Türkçe', code: 'tr' },
];

export const non_eu_langs = ['is', 'nn', 'tr'];
