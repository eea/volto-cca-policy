import React from 'react';
import loadable from '@loadable/component';
import ListingBody from '@plone/volto/components/manage/Blocks/Listing/ListingBody';
import { useSelector, useDispatch } from 'react-redux';
import { getVocabulary } from '@plone/volto/actions';
import { OTHER_REGIONS } from '@eeacms/volto-cca-policy/helpers';
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

  if (impacts) defaultQuery.push(impacts);
  if (sectors) defaultQuery.push(sectors);
  if (measures) defaultQuery.push(measures);

  return {
    block: id,
    limit: data.nr_items,
    query: defaultQuery,
    sort_on: data.sortBy || 'effective',
    sort_order: 'descending',
    template: 'summary',
    itemModel: { '@type': 'simpleItem' },
  };
};

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
    const action = getVocabulary({
      vocabNameOrURL: IMPACTS,
    });
    dispatch(action);
  }, [dispatch]);

  React.useEffect(() => {
    const action = getVocabulary({
      vocabNameOrURL: SECTORS,
    });
    dispatch(action);
  }, [dispatch]);

  React.useEffect(() => {
    const action = getVocabulary({
      vocabNameOrURL: KEY_TYPE,
    });
    dispatch(action);
  }, [dispatch]);

  const listingBodyData = applyQuery(
    id,
    data,
    currentLang,
    impactsQuery,
    sectorsQuery,
    measuresQuery,
  );

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
    </div>
  );
};

export default FilterAceContentView;
