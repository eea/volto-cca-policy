const special = [
  {
    field: 'issued.date',
    factory: 'DropdownRangeFilter',
    wrapper: 'DummySUIFacetWrapper',
    label: ' ',
    showInFacetsList: false,
    filterType: 'any',
    isFilterable: false,
    activeFilterLabel: 'Published',
    isFilter: true,
    showInSecondaryFacetsList: true,
    isMulti: false,
    ignoreFromNlp: true,
    ranges: [
      {
        key: 'All time',
      },
      {
        key: 'Last week',
        from: 'now-1w',
        to: 'now',
      },
      {
        key: 'Last month',
        from: 'now-1m',
        to: 'now',
      },
      {
        key: 'Last 3 months',
        from: 'now-3m',
        to: 'now',
      },
      {
        key: 'Last year',
        from: 'now-1y',
        to: 'now',
      },
      {
        key: 'Last 2 years',
        from: 'now-2y',
        to: 'now',
      },
      {
        key: 'Last 5 years',
        from: 'now-5y',
        to: 'now',
      },
    ],
    default: {
      values: ['Last 5 years'],
      type: 'any',
    },
  },

  {
    field: 'IncludeArchived',
    label: 'Include archived content',
    on: null,
    off: {
      constant_score: {
        filter: {
          bool: {
            should: [
              {
                bool: {
                  must_not: {
                    exists: {
                      field: 'expires',
                    },
                  },
                },
              },
              {
                range: {
                  expires: {
                    gte: '2023-04-27T11:52:29Z',
                  },
                },
              },
            ],
          },
        },
      },
    },
    factory: 'BooleanFacet',
    wrapper: 'DummySUIFacetWrapper',
    showInFacetsList: false,
    id: 'archived-facet',
    showInSecondaryFacetsList: true,
    isFilter: true,
  },
  {
    field: 'op_cluster',
    factory: 'MultiTermFacet',
    isFilterable: true,
    isMulti: true,
    label: 'Section',
    show: 10000,
    showInFacetsList: false,
    ignoreNLPWhenActive: true,
    blacklist: ['Others', 'Publications'],
  },
  {
    field: 'language',
    factory: 'MultiTermFacet',
    label: 'Language',
    showInFacetsList: false,
    filterType: 'any',
    isFilterable: false,
    show: 10000,
    isMulti: true,
    default: {
      values: ['en'],
      type: 'any',
    },
    facetValues: [
      'ar',
      'sr',
      'sq',
      'bg',
      'bs',
      'cs',
      'hr',
      'da',
      'nl',
      'el',
      'en',
      'et',
      'fi',
      'fr',
      'ga',
      'de',
      'hu',
      'is',
      'it',
      'lv',
      'lt',
      'mk',
      'mt',
      'no',
      'pl',
      'pt',
      'ro',
      'ru',
      'sh',
      'sk',
      'sl',
      'es',
      'sv',
      'tr',
    ],
    sortOn: 'custom',
    sortOnCustomLabel: 'Alphabetical',
  },
];

const facets = [
  {
    field: 'objectProvides',
    factory: 'MultiTermFacet',
    label: 'Type of item',
    showInFacetsList: true,
    filterType: 'any',
    isFilterable: false,
    show: 10000,
    isMulti: true,
    iconsFamily: 'Content types',
    optionsFilter: 'typesForClustersOptionsFilter',
  },
  {
    field: 'cca_health_impacts.keyword',
    factory: 'MultiTermFacet',
    label: 'Health impacts',
    showInFacetsList: true,
    filterType: 'any',
    isFilterable: false,
    show: 10000,
    isMulti: true,
    sortOn: 'custom',
    sortOnCustomLabel: 'Alphabetical',
  },
  {
    field: 'cca_origin_websites.keyword',
    factory: 'MultiTermFacet',
    label: 'Observatory partner',
    showInFacetsList: true,
    filterType: 'any',
    isFilterable: false,
    show: 10000,
    isMulti: true,
    sortOn: 'custom',
    sortOnCustomLabel: 'Alphabetical',
  },
  {
    field: 'year',
    factory: 'HistogramFacet',
    label: 'Publishing year',
    height: 100,
    showInFacetsList: true,
    isFilterable: false,
    isMulti: true,
    ranges: [
      {
        from: 1994,
        to: 1995,
      },
      {
        from: 1995,
        to: 1996,
      },
      {
        from: 1996,
        to: 1997,
      },
      {
        from: 1997,
        to: 1998,
      },
      {
        from: 1998,
        to: 1999,
      },
      {
        from: 1999,
        to: 2000,
      },
      {
        from: 2000,
        to: 2001,
      },
      {
        from: 2001,
        to: 2002,
      },
      {
        from: 2002,
        to: 2003,
      },
      {
        from: 2003,
        to: 2004,
      },
      {
        from: 2004,
        to: 2005,
      },
      {
        from: 2005,
        to: 2006,
      },
      {
        from: 2006,
        to: 2007,
      },
      {
        from: 2007,
        to: 2008,
      },
      {
        from: 2008,
        to: 2009,
      },
      {
        from: 2009,
        to: 2010,
      },
      {
        from: 2010,
        to: 2011,
      },
      {
        from: 2011,
        to: 2012,
      },
      {
        from: 2012,
        to: 2013,
      },
      {
        from: 2013,
        to: 2014,
      },
      {
        from: 2014,
        to: 2015,
      },
      {
        from: 2015,
        to: 2016,
      },
      {
        from: 2016,
        to: 2017,
      },
      {
        from: 2017,
        to: 2018,
      },
      {
        from: 2018,
        to: 2019,
      },
      {
        from: 2019,
        to: 2020,
      },
      {
        from: 2020,
        to: 2021,
      },
      {
        from: 2021,
        to: 2022,
      },
      {
        from: 2022,
        to: 2023,
      },
    ],
    step: 10,
    aggs_script:
      "def vals = doc['year']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
  },
  ...special,
];

export default facets;

// {
//   field: 'cca_adaptation_sectors.keyword',
//   factory: 'MultiTermFacet',
//   label: 'Adaptation Sectors',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: false,
//   show: 10000,
//   isMulti: true,
//   sortOn: 'custom',
//   sortOnCustomLabel: 'Alphabetical',
// },
// {
//   field: 'cca_adaptation_elements.keyword',
//   factory: 'MultiTermFacet',
//   label: 'Adaptation Elements',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: false,
//   show: 10000,
//   isMulti: true,
//   sortOn: 'custom',
//   sortOnCustomLabel: 'Alphabetical',
// },
// {
//   field: 'cca_funding_programme.keyword',
//   factory: 'MultiTermFacet',
//   label: 'Funding Programme',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: false,
//   show: 10000,
//   isMulti: true,
//   sortOn: 'custom',
//   sortOnCustomLabel: 'Alphabetical',
// },
// {
//   field: 'cca_geographic_countries.keyword',
//   factory: 'MultiTermFacet',
//   label: 'Countries',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: false,
//   show: 10000,
//   isMulti: true,
//   sortOn: 'custom',
//   sortOnCustomLabel: 'Alphabetical',
// },

// {
//   field: 'cca_adaptation_sectors.keyword',
//   factory: 'MultiTermFacet',
//   label: 'Adaptation Sectors',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: true,
//   show: 10000,
//   isMulti: true,
//   // blacklist: ['reporting', 'Default'],
//   showAllOptions: true,
//   alwaysVisible: true,
// },
//
//
//
// {
//   field: 'time_coverage',
//   factory: 'HistogramFacet',
//   label: 'Time coverage',
//   height: 100,
//   showInFacetsList: true,
//   isFilterable: false,
//   isMulti: true,
//   ranges: [
//     {
//       from: 1700,
//       to: 1710,
//     },
//     {
//       from: 1710,
//       to: 1720,
//     },
//     {
//       from: 1720,
//       to: 1730,
//     },
//     {
//       from: 1730,
//       to: 1740,
//     },
//     {
//       from: 1740,
//       to: 1750,
//     },
//     {
//       from: 1750,
//       to: 1760,
//     },
//     {
//       from: 1760,
//       to: 1770,
//     },
//     {
//       from: 1770,
//       to: 1780,
//     },
//     {
//       from: 1780,
//       to: 1790,
//     },
//     {
//       from: 1790,
//       to: 1800,
//     },
//     {
//       from: 1800,
//       to: 1810,
//     },
//     {
//       from: 1810,
//       to: 1820,
//     },
//     {
//       from: 1820,
//       to: 1830,
//     },
//     {
//       from: 1830,
//       to: 1840,
//     },
//     {
//       from: 1840,
//       to: 1850,
//     },
//     {
//       from: 1850,
//       to: 1860,
//     },
//     {
//       from: 1860,
//       to: 1870,
//     },
//     {
//       from: 1870,
//       to: 1880,
//     },
//     {
//       from: 1880,
//       to: 1890,
//     },
//     {
//       from: 1890,
//       to: 1900,
//     },
//     {
//       from: 1900,
//       to: 1910,
//     },
//     {
//       from: 1910,
//       to: 1920,
//     },
//     {
//       from: 1920,
//       to: 1930,
//     },
//     {
//       from: 1930,
//       to: 1940,
//     },
//     {
//       from: 1940,
//       to: 1950,
//     },
//     {
//       from: 1950,
//       to: 1960,
//     },
//     {
//       from: 1960,
//       to: 1970,
//     },
//     {
//       from: 1970,
//       to: 1980,
//     },
//     {
//       from: 1980,
//       to: 1990,
//     },
//     {
//       from: 1990,
//       to: 2000,
//     },
//     {
//       from: 2000,
//       to: 2010,
//     },
//     {
//       from: 2010,
//       to: 2020,
//     },
//     {
//       from: 2020,
//       to: 2030,
//     },
//     {
//       from: 2030,
//       to: 2040,
//     },
//     {
//       from: 2040,
//       to: 2050,
//     },
//     {
//       from: 2050,
//       to: 2060,
//     },
//     {
//       from: 2060,
//       to: 2070,
//     },
//     {
//       from: 2070,
//       to: 2080,
//     },
//     {
//       from: 2080,
//       to: 2090,
//     },
//     {
//       from: 2090,
//       to: 2100,
//     },
//     {
//       from: 2100,
//       to: 2110,
//     },
//     {
//       from: 2110,
//       to: 2120,
//     },
//     {
//       from: 2120,
//       to: 2130,
//     },
//     {
//       from: 2130,
//       to: 2140,
//     },
//     {
//       from: 2140,
//       to: 2150,
//     },
//     {
//       from: 2150,
//       to: 2160,
//     },
//     {
//       from: 2160,
//       to: 2170,
//     },
//     {
//       from: 2170,
//       to: 2180,
//     },
//     {
//       from: 2180,
//       to: 2190,
//     },
//     {
//       from: 2190,
//       to: 2200,
//     },
//     {
//       from: 2200,
//       to: 2210,
//     },
//   ],
//   step: 10,
//   aggs_script:
//     "def vals = doc['time_coverage']; if (vals.length == 0){return 2500} else {def ret = [];for (val in vals){def tmp_val = val.substring(0,4);ret.add(tmp_val.toLowerCase() == tmp_val.toUpperCase() ? Integer.parseInt(tmp_val) : 2500);}return ret;}",
// },
// {
//   field: 'readingTime',
//   factory: 'FixedRangeFacet',
//   label: 'Reading time',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: false,
//   rangeType: 'fixed',
//   isMulti: true,
//   ranges: [
//     {
//       key: 'All',
//     },
//     {
//       from: 0,
//       to: 4.99999,
//       key: 'Short (<5 minutes)',
//     },
//     {
//       from: 5,
//       to: 24.9999,
//       key: 'Medium (5-25 minutes)',
//     },
//     {
//       from: 25,
//       to: 10000,
//       key: 'Large (25+ minutes)',
//     },
//   ],
//   default: {
//     values: [
//       {
//         name: 'All',
//         rangeType: 'fixed',
//       },
//     ],
//     type: 'any',
//   },
// },
//
// {
//   field: 'moreLikeThis',
//   factory: 'MoreLikeThis',
//   label: 'More like this',
//   showInFacetsList: false,
//   filterType: 'any',
//   isFilterable: true,
//   show: 10000,
//   isMulti: false,
//   filterListComponent: 'MoreLikeThisEntry',
//   condition: 'like',
//   queryParams: {
//     fields: ['title', 'text'],
//     min_term_freq: 1,
//     max_query_terms: 12,
//   },
// },

// {
//   field: 'topic',
//   factory: 'MultiTermFacet',
//   label: 'Topics',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: true,
//   show: 10000,
//   isMulti: true,
//   blacklist: ['reporting', 'Default'],
//   showAllOptions: true,
//   alwaysVisible: true,
// },

// {
//   field: 'subject.keyword',
//   factory: 'MultiTermFacet',
//   label: 'Keywords',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: true,
//   show: 10000,
//   isMulti: true,
//   showAllOptions: true,
//   alwaysVisible: false,
// },
// {
//   field: 'spatial',
//   factory: 'MultiTermFacet',
//   label: 'Countries',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: true,
//   show: 10000,
//   isMulti: true,
//   whitelist: [
//     'Andorra',
//     'United Arab Emirates',
//     'Afghanistan',
//     'Antigua and Barbuda',
//     'Anguilla',
//     'Albania',
//     'Armenia',
//     'Angola',
//     'Antarctica',
//     'Argentina',
//     'American Samoa',
//     'Austria',
//     'Australia',
//     'Aruba',
//     'Åland',
//     'Azerbaijan',
//     'Bosnia and Herzegovina',
//     'Barbados',
//     'Bangladesh',
//     'Belgium',
//     'Burkina Faso',
//     'Bulgaria',
//     'Bahrain',
//     'Burundi',
//     'Benin',
//     'Saint Barthélemy',
//     'Bermuda',
//     'Brunei',
//     'Bolivia',
//     'Bonaire',
//     'Brazil',
//     'Bahamas',
//     'Bhutan',
//     'Bouvet Island',
//     'Botswana',
//     'Belarus',
//     'Belize',
//     'Canada',
//     'Cocos [Keeling] Islands',
//     'Democratic Republic of the Congo',
//     'Central African Republic',
//     'Republic of the Congo',
//     'Switzerland',
//     'Ivory Coast',
//     'Cook Islands',
//     'Chile',
//     'Cameroon',
//     'China',
//     'Colombia',
//     'Costa Rica',
//     'Cuba',
//     'Cape Verde',
//     'Curacao',
//     'Christmas Island',
//     'Cyprus',
//     'Czech Republic',
//     'Germany',
//     'Djibouti',
//     'Denmark',
//     'Dominica',
//     'Dominican Republic',
//     'Algeria',
//     'Ecuador',
//     'Estonia',
//     'Egypt',
//     'Western Sahara',
//     'Eritrea',
//     'Spain',
//     'Ethiopia',
//     'Finland',
//     'Fiji',
//     'Falkland Islands',
//     'Micronesia',
//     'Faroe Islands',
//     'France',
//     'Gabon',
//     'United Kingdom',
//     'Grenada',
//     'Georgia',
//     'French Guiana',
//     'Guernsey',
//     'Ghana',
//     'Gibraltar',
//     'Greenland',
//     'Gambia',
//     'Guinea',
//     'Guadeloupe',
//     'Equatorial Guinea',
//     'Greece',
//     'South Georgia and the South Sandwich Islands',
//     'Guatemala',
//     'Guam',
//     'Guinea-Bissau',
//     'Guyana',
//     'Hong Kong',
//     'Heard Island and McDonald Islands',
//     'Honduras',
//     'Croatia',
//     'Haiti',
//     'Hungary',
//     'Indonesia',
//     'Ireland',
//     'Israel',
//     'Isle of Man',
//     'India',
//     'British Indian Ocean Territory',
//     'Iraq',
//     'Iran',
//     'Iceland',
//     'Italy',
//     'Jersey',
//     'Jamaica',
//     'Jordan',
//     'Japan',
//     'Kenya',
//     'Kyrgyzstan',
//     'Cambodia',
//     'Kiribati',
//     'Comoros',
//     'Saint Kitts and Nevis',
//     'North Korea',
//     'South Korea',
//     'Kuwait',
//     'Cayman Islands',
//     'Kazakhstan',
//     'Laos',
//     'Lebanon',
//     'Saint Lucia',
//     'Liechtenstein',
//     'Sri Lanka',
//     'Liberia',
//     'Lesotho',
//     'Lithuania',
//     'Luxembourg',
//     'Latvia',
//     'Libya',
//     'Morocco',
//     'Monaco',
//     'Moldova',
//     'Montenegro',
//     'Saint Martin',
//     'Madagascar',
//     'Marshall Islands',
//     'Macedonia',
//     'Mali',
//     'Myanmar [Burma]',
//     'Mongolia',
//     'Macao',
//     'Northern Mariana Islands',
//     'Martinique',
//     'Mauritania',
//     'Montserrat',
//     'Malta',
//     'Mauritius',
//     'Maldives',
//     'Malawi',
//     'Mexico',
//     'Malaysia',
//     'Mozambique',
//     'Namibia',
//     'New Caledonia',
//     'Niger',
//     'Norfolk Island',
//     'Nigeria',
//     'Nicaragua',
//     'Netherlands',
//     'Norway',
//     'Nepal',
//     'Nauru',
//     'Niue',
//     'New Zealand',
//     'Oman',
//     'Panama',
//     'Peru',
//     'French Polynesia',
//     'Papua New Guinea',
//     'Philippines',
//     'Pakistan',
//     'Poland',
//     'Saint Pierre and Miquelon',
//     'Pitcairn Islands',
//     'Puerto Rico',
//     'Palestine',
//     'Portugal',
//     'Palau',
//     'Paraguay',
//     'Qatar',
//     'Réunion',
//     'Romania',
//     'Serbia',
//     'Russia',
//     'Rwanda',
//     'Saudi Arabia',
//     'Solomon Islands',
//     'Seychelles',
//     'Sudan',
//     'Sweden',
//     'Singapore',
//     'Saint Helena',
//     'Slovenia',
//     'Svalbard and Jan Mayen',
//     'Slovakia',
//     'Sierra Leone',
//     'San Marino',
//     'Senegal',
//     'Somalia',
//     'Suriname',
//     'South Sudan',
//     'São Tomé and Príncipe',
//     'El Salvador',
//     'Sint Maarten',
//     'Syria',
//     'Swaziland',
//     'Turks and Caicos Islands',
//     'Chad',
//     'French Southern Territories',
//     'Togo',
//     'Thailand',
//     'Tajikistan',
//     'Tokelau',
//     'East Timor',
//     'Turkmenistan',
//     'Tunisia',
//     'Tonga',
//     'Türkiye',
//     'Trinidad and Tobago',
//     'Tuvalu',
//     'Taiwan',
//     'Tanzania',
//     'Ukraine',
//     'Uganda',
//     'U.S. Minor Outlying Islands',
//     'United States',
//     'Uruguay',
//     'Uzbekistan',
//     'Vatican City',
//     'Saint Vincent and the Grenadines',
//     'Venezuela',
//     'British Virgin Islands',
//     'U.S. Virgin Islands',
//     'Vietnam',
//     'Vanuatu',
//     'Wallis and Futuna',
//     'Samoa',
//     'Kosovo (UNSCR 1244/99)',
//     'Yemen',
//     'Mayotte',
//     'South Africa',
//     'Zambia',
//     'Zimbabwe',
//     'Russia',
//     'Czechia',
//     'Kosovo',
//     'Macedonia',
//     'Former Yugoslav Republic of Macedonia, the',
//     'Macedonia (FYR)',
//     'England',
//     'Scotland',
//     'Wales',
//     'Northern Ireland',
//     'North Macedonia',
//     'Congo',
//   ],
//   iconsFamily: 'Countries',
//   enableExact: true,
//   sortOn: 'value',
//   alwaysVisible: false,
// },
// {
//   field: 'op_cluster',
//   factory: 'MultiTermFacet',
//   label: 'Section',
//   showInFacetsList: false,
//   filterType: 'any',
//   isFilterable: true,
//   show: 10000,
//   isMulti: true,
//   ignoreNLPWhenActive: true,
// },
// {
//   field: 'cluster_name',
//   factory: 'MultiTermFacet',
//   label: 'Websites',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: false,
//   show: 10000,
//   isMulti: true,
//   iconsFamily: 'Sources',
//   alwaysVisible: true,
// },
// {
//   field: 'places',
//   factory: 'MultiTermFacet',
//   label: 'Regions/Places',
//   showInFacetsList: true,
//   filterType: 'any',
//   isFilterable: true,
//   show: 10000,
//   isMulti: true,
//   blacklist: [
//     'Andorra',
//     'United Arab Emirates',
//     'Afghanistan',
//     'Antigua and Barbuda',
//     'Anguilla',
//     'Albania',
//     'Armenia',
//     'Angola',
//     'Antarctica',
//     'Argentina',
//     'American Samoa',
//     'Austria',
//     'Australia',
//     'Aruba',
//     'Åland',
//     'Azerbaijan',
//     'Bosnia and Herzegovina',
//     'Barbados',
//     'Bangladesh',
//     'Belgium',
//     'Burkina Faso',
//     'Bulgaria',
//     'Bahrain',
//     'Burundi',
//     'Benin',
//     'Saint Barthélemy',
//     'Bermuda',
//     'Brunei',
//     'Bolivia',
//     'Bonaire',
//     'Brazil',
//     'Bahamas',
//     'Bhutan',
//     'Bouvet Island',
//     'Botswana',
//     'Belarus',
//     'Belize',
//     'Canada',
//     'Cocos [Keeling] Islands',
//     'Democratic Republic of the Congo',
//     'Central African Republic',
//     'Republic of the Congo',
//     'Switzerland',
//     'Ivory Coast',
//     'Cook Islands',
//     'Chile',
//     'Cameroon',
//     'China',
//     'Colombia',
//     'Costa Rica',
//     'Cuba',
//     'Cape Verde',
//     'Curacao',
//     'Christmas Island',
//     'Cyprus',
//     'Czech Republic',
//     'Germany',
//     'Djibouti',
//     'Denmark',
//     'Dominica',
//     'Dominican Republic',
//     'Algeria',
//     'Ecuador',
//     'Estonia',
//     'Egypt',
//     'Western Sahara',
//     'Eritrea',
//     'Spain',
//     'Ethiopia',
//     'Finland',
//     'Fiji',
//     'Falkland Islands',
//     'Micronesia',
//     'Faroe Islands',
//     'France',
//     'Gabon',
//     'United Kingdom',
//     'Grenada',
//     'Georgia',
//     'French Guiana',
//     'Guernsey',
//     'Ghana',
//     'Gibraltar',
//     'Greenland',
//     'Gambia',
//     'Guinea',
//     'Guadeloupe',
//     'Equatorial Guinea',
//     'Greece',
//     'South Georgia and the South Sandwich Islands',
//     'Guatemala',
//     'Guam',
//     'Guinea-Bissau',
//     'Guyana',
//     'Hong Kong',
//     'Heard Island and McDonald Islands',
//     'Honduras',
//     'Croatia',
//     'Haiti',
//     'Hungary',
//     'Indonesia',
//     'Ireland',
//     'Israel',
//     'Isle of Man',
//     'India',
//     'British Indian Ocean Territory',
//     'Iraq',
//     'Iran',
//     'Iceland',
//     'Italy',
//     'Jersey',
//     'Jamaica',
//     'Jordan',
//     'Japan',
//     'Kenya',
//     'Kyrgyzstan',
//     'Cambodia',
//     'Kiribati',
//     'Comoros',
//     'Saint Kitts and Nevis',
//     'North Korea',
//     'South Korea',
//     'Kuwait',
//     'Cayman Islands',
//     'Kazakhstan',
//     'Laos',
//     'Lebanon',
//     'Saint Lucia',
//     'Liechtenstein',
//     'Sri Lanka',
//     'Liberia',
//     'Lesotho',
//     'Lithuania',
//     'Luxembourg',
//     'Latvia',
//     'Libya',
//     'Morocco',
//     'Monaco',
//     'Moldova',
//     'Montenegro',
//     'Saint Martin',
//     'Madagascar',
//     'Marshall Islands',
//     'Macedonia',
//     'Mali',
//     'Myanmar [Burma]',
//     'Mongolia',
//     'Macao',
//     'Northern Mariana Islands',
//     'Martinique',
//     'Mauritania',
//     'Montserrat',
//     'Malta',
//     'Mauritius',
//     'Maldives',
//     'Malawi',
//     'Mexico',
//     'Malaysia',
//     'Mozambique',
//     'Namibia',
//     'New Caledonia',
//     'Niger',
//     'Norfolk Island',
//     'Nigeria',
//     'Nicaragua',
//     'Netherlands',
//     'Norway',
//     'Nepal',
//     'Nauru',
//     'Niue',
//     'New Zealand',
//     'Oman',
//     'Panama',
//     'Peru',
//     'French Polynesia',
//     'Papua New Guinea',
//     'Philippines',
//     'Pakistan',
//     'Poland',
//     'Saint Pierre and Miquelon',
//     'Pitcairn Islands',
//     'Puerto Rico',
//     'Palestine',
//     'Portugal',
//     'Palau',
//     'Paraguay',
//     'Qatar',
//     'Réunion',
//     'Romania',
//     'Serbia',
//     'Russia',
//     'Rwanda',
//     'Saudi Arabia',
//     'Solomon Islands',
//     'Seychelles',
//     'Sudan',
//     'Sweden',
//     'Singapore',
//     'Saint Helena',
//     'Slovenia',
//     'Svalbard and Jan Mayen',
//     'Slovakia',
//     'Sierra Leone',
//     'San Marino',
//     'Senegal',
//     'Somalia',
//     'Suriname',
//     'South Sudan',
//     'São Tomé and Príncipe',
//     'El Salvador',
//     'Sint Maarten',
//     'Syria',
//     'Swaziland',
//     'Turks and Caicos Islands',
//     'Chad',
//     'French Southern Territories',
//     'Togo',
//     'Thailand',
//     'Tajikistan',
//     'Tokelau',
//     'East Timor',
//     'Turkmenistan',
//     'Tunisia',
//     'Tonga',
//     'Türkiye',
//     'Trinidad and Tobago',
//     'Tuvalu',
//     'Taiwan',
//     'Tanzania',
//     'Ukraine',
//     'Uganda',
//     'U.S. Minor Outlying Islands',
//     'United States',
//     'Uruguay',
//     'Uzbekistan',
//     'Vatican City',
//     'Saint Vincent and the Grenadines',
//     'Venezuela',
//     'British Virgin Islands',
//     'U.S. Virgin Islands',
//     'Vietnam',
//     'Vanuatu',
//     'Wallis and Futuna',
//     'Samoa',
//     'Kosovo (UNSCR 1244/99)',
//     'Yemen',
//     'Mayotte',
//     'South Africa',
//     'Zambia',
//     'Zimbabwe',
//     'Russia',
//     'Czechia',
//     'Kosovo',
//     'Macedonia',
//     'Former Yugoslav Republic of Macedonia, the',
//     'Macedonia (FYR)',
//     'England',
//     'Scotland',
//     'Wales',
//     'Northern Ireland',
//     'North Macedonia',
//     'Congo',
//     '6',
//     '8',
//     '9',
//     '1',
//   ],
//   showAllOptions: true,
//   alwaysVisible: true,
// },
