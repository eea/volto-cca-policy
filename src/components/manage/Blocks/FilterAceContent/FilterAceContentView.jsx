import React from 'react';
import loadable from '@loadable/component';
import ListingBody from '@plone/volto/components/manage/Blocks/Listing/ListingBody';
import { useSelector, useDispatch } from 'react-redux';
import { getVocabulary } from '@plone/volto/actions';
import { OTHER_REGIONS } from '@eeacms/volto-cca-policy/helpers';
import { Link } from 'react-router-dom';
import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
// TODO: internationalize
import { FormattedMessage } from 'react-intl';

import './style.less';

const Select = loadable(() => import('react-select'));

const IMPACTS = 'eea.climateadapt.aceitems_climateimpacts';
const SECTORS = 'eea.climateadapt.aceitems_sectors';
const KEY_TYPE = 'eea.climateadapt.aceitems_key_type_measures_short';

const FIELDS = [
  'bio_regions',
  'countries',
  'element_type',
  'funding_programme',
  'macro_regions',
  'origin_website',
  'search_text',
  'search_type',
  'sector',
  'special_tags',
];

const fieldmap = {
  origin_website: 'origin_website',
  search_type: 'search_type',
  element_type: 'elements',
  search_text: 'SearchableText',
  special_tags: 'special_tags',
  sector: 'sectors',
  countries: 'countries',
  macro_regions: 'macro_regions',
  bio_regions: 'bio_regions',
  funding_programme: 'funding_programme',
};

const otherMacroRegions = [
  'TRANS_BIO_MACARO',
  'TRANS_MACRO_CAR_AREA',
  'TRANS_MACRO_AMAZONIA',
  'TRANS_BIO_ANATOLIAN',
  'TRANS_MACRO_IND_OCEAN_AREA',
];

const impacts_no_value = [
  {
    label: 'All climate impacts',
    value: '',
  },
];

const sectors_no_value = [
  {
    label: 'All adaptation sectors',
    value: '',
  },
];

const measures_no_value = [
  {
    label: 'All key type measures',
    value: '',
  },
];

const _datatypes = {
  DOCUMENT: 'Publications and reports',
  INFORMATIONSOURCE: 'Information portal',
  MAPGRAPHDATASET: 'Maps, graphs and datasets',
  INDICATOR: 'Indicator',
  GUIDANCE: 'Guidance',
  TOOL: 'Tool',
  RESEARCHPROJECT: 'Research and knowledge project',
  MEASURE: 'Adaptation option',
  ACTION: 'Case study',
  ORGANISATION: 'Organisation',
  VIDEOS: 'Videos',
};

const applyQuery = (id, data, currentLang, impacts, sectors, measures) => {
  const defaultQuery = Object.entries(data)
    .filter(
      ([field, value]) => FIELDS.includes(field) && value && value.length > 0,
    )
    .map(([field, value]) => {
      let values = [];
      if (value.includes(OTHER_REGIONS)) {
        values = [...value, ...otherMacroRegions];
        values.splice(values.indexOf(OTHER_REGIONS), 1);
      } else {
        values = value;
      }

      return {
        i: fieldmap[field],
        o: 'plone.app.querystring.operation.selection.any',
        v: values,
      };
    });

  defaultQuery.push({
    i: 'Language',
    o: 'plone.app.querystring.operation.selection.any',
    v: currentLang,
  });

  defaultQuery.push({
    i: 'review_state',
    o: 'plone.app.querystring.operation.selection.any',
    v: 'published',
  });

  if (impacts) defaultQuery.push(impacts);
  if (sectors) defaultQuery.push(sectors);
  if (measures) defaultQuery.push(measures);

  const sort_on = data.sortBy || 'effective';
  return {
    block: id,
    limit: data.nr_items,
    query: defaultQuery,
    sort_on,
    sort_order: sort_on === 'getId' ? 'ascending' : 'descending',
    template: 'summary',
    itemModel: { '@type': 'simpleItem' },
  };
};

// mapping of "internal data stored fieldname" to name of EEA Search facet field
// TODO: this needs to be completed. As of today (21-05-2024), all the fields that are used in production blocks are present, but not all possible of them are properly declared here
const eeaSearchFieldMap = {
  impacts: 'cca_climate_impacts.keyword',
  sectors: 'cca_adaptation_sectors.keyword',
  measures: 'cca_key_type_measure.keyword',
  funding_programme: 'cca_funding_programme.keyword',
  search_type: 'objectProvides',
  language: 'language',
};

function toLabel(value, key, vocab) {
  if (key === 'search_type') return _datatypes[value];
  if (key === 'measures') return value;
  if (!vocab) return value;

  return vocab.find(({ value: v }) => value === v)?.label || value;
}

function buildQueryUrl({ vocabs, ...data }) {
  let filters = Object.keys(data).reduce((acc, key) => {
    const name = eeaSearchFieldMap[key];
    const ploneFilter = data[key];
    if (ploneFilter) {
      const realValue = ploneFilter?.v || ploneFilter;
      let filter = [
        `filters[$index][field]=${name}`,
        `filters[$index][type]=any`,
      ];
      if (Array.isArray(realValue)) {
        const mv = realValue.map((rv) => toLabel(rv, key, vocabs[key]));
        mv.forEach((v, i) => {
          filter.push(`filters[$index][values][${i}]=${encodeURIComponent(v)}`);
        });
      } else {
        const rv = toLabel(realValue, key, vocabs[key]);
        filter.push(`filters[$index][values][0]=${encodeURIComponent(rv)}`);
      }

      filter = filter.join('&');
      acc.push(filter);
    }
    return acc;
  }, []);

  filters = filters
    .map((line, index) => line.replaceAll('$index', index))
    .join('&');
  const url = `/en/data-and-downloads?size=n_10&${filters}`;

  return url;
}

const vocabImpactsAction = getVocabulary({
  vocabNameOrURL: IMPACTS,
});
const vocabSectorsAction = getVocabulary({
  vocabNameOrURL: SECTORS,
});
const vocabMeasuresAction = getVocabulary({
  vocabNameOrURL: KEY_TYPE,
});

const FilterAceContentView = (props) => {
  const { data, id, mode = 'view' } = props;
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.intl.locale);
  const impactsVocabItems = useSelector((state) =>
    state.vocabularies[IMPACTS]?.loaded
      ? state.vocabularies[IMPACTS].items
      : [],
  );
  const sectorsVocabItems = useSelector((state) =>
    state.vocabularies[SECTORS]?.loaded
      ? state.vocabularies[SECTORS].items
      : [],
  );
  const measuresVocabItems = useSelector((state) =>
    state.vocabularies[KEY_TYPE]?.loaded
      ? state.vocabularies[KEY_TYPE].items
      : [],
  );

  const [impactsQuery, setImpactsQueryQuery] = React.useState();
  const [sectorsQuery, setSectorsQuery] = React.useState();
  const [measuresQuery, setMeasuresQuery] = React.useState();

  React.useEffect(() => {
    dispatch(vocabImpactsAction);
    dispatch(vocabSectorsAction);
    dispatch(vocabMeasuresAction);
  }, [dispatch]);

  const listingBodyData = applyQuery(
    id,
    data,
    currentLang,
    impactsQuery,
    sectorsQuery,
    measuresQuery,
  );
  const viewAllUrl = buildQueryUrl({
    // ...data,
    impacts: impactsQuery,
    sectors: sectorsQuery,
    measures: measuresQuery,
    search_type: data.search_type,
    funding_programme: data.funding_programme,
    language: currentLang,
    vocabs: {
      sectors: sectorsVocabItems,
      measures: measuresVocabItems,
      impacts: impactsVocabItems,
    },
  });

  // console.log({ allData: data, viewAllUrl });

  return (
    <div className="block filter-acecontent-block">
      {data.title && <h4>{data.title}</h4>}
      <span className="filter-title">
        <FormattedMessage id="Climate impact" defaultMessage="Climate impact" />
      </span>
      <div>
        <Select
          id="field-impacts"
          name="impacts"
          disabled={false}
          className="react-select-container"
          classNamePrefix="react-select"
          options={[impacts_no_value[0], ...(impactsVocabItems || [])]}
          styles={customSelectStyles}
          theme={selectTheme}
          components={{ DropdownIndicator, Option }}
          defaultValue={impacts_no_value}
          onChange={({ value }) => {
            if (value) {
              setImpactsQueryQuery({
                i: 'climate_impacts',
                o: 'plone.app.querystring.operation.selection.any',
                v: value,
              });
            } else {
              setImpactsQueryQuery(null);
            }
          }}
        />
      </div>

      <span className="filter-title">
        <FormattedMessage id="Sector" defaultMessage="Sector" />
      </span>
      <Select
        id="field-sectors"
        name="sectors"
        disabled={false}
        className="react-select-container"
        classNamePrefix="react-select"
        options={[sectors_no_value[0], ...(sectorsVocabItems || [])]}
        styles={customSelectStyles}
        theme={selectTheme}
        components={{ DropdownIndicator, Option }}
        defaultValue={sectors_no_value}
        onChange={({ value }) => {
          if (value) {
            setSectorsQuery({
              i: 'sectors',
              o: 'plone.app.querystring.operation.selection.any',
              v: value.toUpperCase(),
            });
          } else {
            setSectorsQuery(null);
          }
        }}
      />

      <div id="key-type-measure">
        <span className="filter-title">
          <FormattedMessage
            id="Key Type Measure"
            defaultMessage="Key Type Measure"
          />
        </span>
        <Select
          id="field-measure"
          name="measure"
          disabled={false}
          className="react-select-container"
          classNamePrefix="react-select"
          options={[measures_no_value[0], ...(measuresVocabItems || [])]}
          styles={customSelectStyles}
          theme={selectTheme}
          components={{ DropdownIndicator, Option }}
          defaultValue={measures_no_value}
          onChange={({ value }) => {
            if (value) {
              setMeasuresQuery({
                i: 'key_type_measures',
                o: 'plone.app.querystring.operation.selection.any',
                v: value,
              });
            } else {
              setMeasuresQuery(null);
            }
          }}
        />
      </div>
      <div className="listing-wrapper">
        <ListingBody
          id={id}
          data={listingBodyData}
          path={props.path}
          isEditMode={mode === 'edit'}
        />
      </div>
      <Link className="ui button secondary inverted" to={viewAllUrl}>
        View all
      </Link>
    </div>
  );
};

export default FilterAceContentView;
