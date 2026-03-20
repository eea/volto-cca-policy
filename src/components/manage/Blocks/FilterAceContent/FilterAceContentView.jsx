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
import { Grid } from 'semantic-ui-react';
// TODO: internationalize
import { FormattedMessage } from 'react-intl';

import config from '@plone/volto/registry';
import './style.less';

const Select = loadable(() => import('react-select'));

const IMPACTS = 'eea.climateadapt.aceitems_climateimpacts';
const SECTORS = 'eea.climateadapt.aceitems_sectors';
const ELEMENTS = 'eea.climateadapt.aceitems_elements';
const KEY_TYPE = 'eea.climateadapt.aceitems_key_type_measures_short';

const otherMacroRegions = [
  'TRANS_BIO_MACARO',
  'TRANS_MACRO_CAR_AREA',
  'TRANS_MACRO_AMAZONIA',
  'TRANS_BIO_ANATOLIAN',
  'TRANS_MACRO_IND_OCEAN_AREA',
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

const applyQuery = (
  id,
  data,
  currentLang,
  impacts,
  sectors,
  elements,
  measures,
) => {
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
  if (elements) defaultQuery.push(elements);
  if (measures) defaultQuery.push(measures);

  const sort_on = data.sortBy || 'effective';

  return {
    block: id,
    limit: data.nr_items,
    query: defaultQuery,
    sort_on,
    sort_order: sort_on === 'getId' ? 'ascending' : 'descending',
    // template: 'summary',
    // itemModel: { '@type': 'simpleItem' },
  };
};

// mapping of "internal data stored fieldname" to name of EEA Search facet field
// TODO: this needs to be completed. As of today (21-05-2024), all the fields that are used in production blocks are present, but not all possible of them are properly declared here
const eeaSearchFieldMap = {
  impacts: 'cca_climate_impacts.keyword',
  sectors: 'cca_adaptation_sectors.keyword',
  elements: 'cca_adaptation_elements.keyword',
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
    if (!name || !ploneFilter) return acc;

    const realValue = ploneFilter?.v ?? ploneFilter;

    const type = Array.isArray(realValue) ? 'all' : 'any';

    let filter = [
      `filters[$index][field]=${name}`,
      `filters[$index][type]=${type}`,
    ];

    (Array.isArray(realValue) ? realValue : [realValue])
      .map((rv) => toLabel(rv, key, vocabs?.[key]))
      .forEach((v, i) => {
        filter.push(`filters[$index][values][${i}]=${encodeURIComponent(v)}`);
      });

    acc.push(filter.join('&'));
    return acc;
  }, []);

  filters = filters
    .map((line, index) => line.replaceAll('$index', index))
    .join('&');

  return `/en/data-and-downloads?size=n_10&${filters}`;
}

const vocabImpactsAction = getVocabulary({ vocabNameOrURL: IMPACTS });
const vocabSectorsAction = getVocabulary({ vocabNameOrURL: SECTORS });
const vocabElementsAction = getVocabulary({ vocabNameOrURL: ELEMENTS });
const vocabMeasuresAction = getVocabulary({ vocabNameOrURL: KEY_TYPE });

function ListingWrapper({ id, listingBodyData, path, isEditMode, variation }) {
  const getListingBodyVariation = () => {
    const variations = config.blocks.blocksConfig.listing.variations || [];
    return (
      variations.find((v) => v.id === variation) ||
      variations.find((v) => v.isDefault) ||
      variations[0]
    );
  };

  const listingVariation = getListingBodyVariation();

  return (
    <div className="listing-wrapper">
      <ListingBody
        id={id}
        data={listingBodyData}
        path={path}
        isEditMode={isEditMode}
        variation={listingVariation}
      />
    </div>
  );
}

function FiltersPanel({
  impactsVocabItems,
  sectorsVocabItems,
  elementsVocabItems,
  measuresVocabItems,
  selectedImpacts,
  selectedSectors,
  selectedElements,
  selectedMeasures,
  onImpactsChange,
  onSectorsChange,
  onElementsChange,
  onMeasuresChange,
  variation,
}) {
  return (
    <div className={`filters-panel ${variation}`}>
      <span className="filter-title">
        <FormattedMessage id="Climate impact" defaultMessage="Climate impact" />
      </span>
      <Select
        isMulti
        isClearable={false}
        id="field-impacts"
        name="impacts"
        className="react-select-container"
        classNamePrefix="react-select"
        options={impactsVocabItems || []}
        styles={customSelectStyles}
        theme={selectTheme}
        components={{ DropdownIndicator, Option }}
        value={selectedImpacts}
        onChange={(opts) => onImpactsChange((opts || []).map((op) => op.value))}
      />

      <span className="filter-title">
        <FormattedMessage id="Sector" defaultMessage="Sector" />
      </span>
      <Select
        isMulti
        isClearable={false}
        id="field-sectors"
        name="sectors"
        className="react-select-container"
        classNamePrefix="react-select"
        options={sectorsVocabItems || []}
        styles={customSelectStyles}
        theme={selectTheme}
        components={{ DropdownIndicator, Option }}
        value={selectedSectors}
        onChange={(opts) => onSectorsChange((opts || []).map((op) => op.value))}
      />

      <span className="filter-title">
        <FormattedMessage
          id="Adaptation Approaches"
          defaultMessage="Adaptation Approaches"
        />
      </span>
      <Select
        isMulti
        isClearable={false}
        id="field-elements"
        name="elements"
        className="react-select-container"
        classNamePrefix="react-select"
        options={elementsVocabItems || []}
        styles={customSelectStyles}
        theme={selectTheme}
        components={{ DropdownIndicator, Option }}
        value={selectedElements}
        onChange={(opts) =>
          onElementsChange((opts || []).map((op) => op.value))
        }
      />

      <div id="key-type-measure">
        <span className="filter-title">
          <FormattedMessage
            id="Key Type Measure"
            defaultMessage="Key Type Measure"
          />
        </span>
        <Select
          isMulti
          isClearable={false}
          id="field-measure"
          name="measure"
          className="react-select-container"
          classNamePrefix="react-select"
          options={measuresVocabItems || []}
          styles={customSelectStyles}
          theme={selectTheme}
          components={{ DropdownIndicator, Option }}
          value={selectedMeasures}
          onChange={(opts) =>
            onMeasuresChange((opts || []).map((op) => op.value))
          }
        />
      </div>
    </div>
  );
}

const FilterAceContentView = (props) => {
  const { data, id, mode = 'view', path } = props;
  const { title, variation = 'simpleListing', button_label } = data;

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
  const elementsVocabItems = useSelector((state) =>
    state.vocabularies[ELEMENTS]?.loaded
      ? state.vocabularies[ELEMENTS].items
      : [],
  );
  const measuresVocabItems = useSelector((state) =>
    state.vocabularies[KEY_TYPE]?.loaded
      ? state.vocabularies[KEY_TYPE].items
      : [],
  );

  const [impactsQuery, setImpactsQuery] = React.useState(null);
  const [sectorsQuery, setSectorsQuery] = React.useState(null);
  const [elementsQuery, setElementsQuery] = React.useState(null);
  const [measuresQuery, setMeasuresQuery] = React.useState(null);

  React.useEffect(() => {
    dispatch(vocabImpactsAction);
    dispatch(vocabSectorsAction);
    dispatch(vocabElementsAction);
    dispatch(vocabMeasuresAction);
  }, [dispatch]);

  const listingBodyData = applyQuery(
    id,
    data,
    currentLang,
    impactsQuery,
    sectorsQuery,
    elementsQuery,
    measuresQuery,
  );

  const viewAllUrl = buildQueryUrl({
    impacts: impactsQuery,
    sectors: sectorsQuery,
    elements: elementsQuery,
    measures: measuresQuery,
    search_type: data.search_type,
    funding_programme: data.funding_programme,
    language: currentLang,
    vocabs: {
      sectors: sectorsVocabItems,
      elements: elementsVocabItems,
      measures: measuresVocabItems,
      impacts: impactsVocabItems,
    },
  });

  const selectedImpacts = impactsQuery?.v
    ? impactsVocabItems.filter((o) => impactsQuery.v.includes(o.value))
    : [];

  const selectedSectors = sectorsQuery?.v
    ? sectorsVocabItems.filter((o) => sectorsQuery.v.includes(o.value))
    : [];

  const selectedElements = elementsQuery?.v
    ? elementsVocabItems.filter((o) => elementsQuery.v.includes(o.value))
    : [];

  const selectedMeasures = measuresQuery?.v
    ? measuresVocabItems.filter((o) => measuresQuery.v.includes(o.value))
    : [];

  const filters = (
    <FiltersPanel
      variation={variation}
      impactsVocabItems={impactsVocabItems}
      sectorsVocabItems={sectorsVocabItems}
      elementsVocabItems={elementsVocabItems}
      measuresVocabItems={measuresVocabItems}
      selectedImpacts={selectedImpacts}
      selectedSectors={selectedSectors}
      selectedElements={selectedElements}
      selectedMeasures={selectedMeasures}
      onImpactsChange={(values) => {
        setImpactsQuery(
          values && values.length > 0
            ? {
                i: 'climate_impacts',
                o: 'plone.app.querystring.operation.selection.all',
                v: values,
              }
            : null,
        );
      }}
      onSectorsChange={(values) => {
        setSectorsQuery(
          values && values.length > 0
            ? {
                i: 'sectors',
                o: 'plone.app.querystring.operation.selection.all',
                v: values,
              }
            : null,
        );
      }}
      onElementsChange={(values) => {
        setElementsQuery(
          values && values.length > 0
            ? {
                i: 'elements',
                o: 'plone.app.querystring.operation.selection.all',
                v: values,
              }
            : null,
        );
      }}
      onMeasuresChange={(values) => {
        setMeasuresQuery(
          values && values.length > 0
            ? {
                i: 'key_type_measures',
                o: 'plone.app.querystring.operation.selection.all',
                v: values,
              }
            : null,
        );
      }}
    />
  );

  const listing = (
    <ListingWrapper
      id={id}
      path={path}
      variation={variation}
      listingBodyData={listingBodyData}
      isEditMode={mode === 'edit'}
    />
  );

  const viewAllButton = (
    <Link className="ui button primary inverted view-btn" to={viewAllUrl}>
      {button_label || 'View all'}
    </Link>
  );

  return (
    <div className={`block filter-acecontent-block ${variation}-view`}>
      {title && <h4>{title}</h4>}

      {variation === 'simpleCards' ? (
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              {filters}
              {viewAllButton}
            </Grid.Column>

            <Grid.Column width={8}>{listing}</Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <>
          {filters}
          {listing}
          {viewAllButton}
        </>
      )}
    </div>
  );
};

export default FilterAceContentView;
