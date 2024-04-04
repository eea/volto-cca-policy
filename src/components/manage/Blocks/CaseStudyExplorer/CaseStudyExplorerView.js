import React from 'react';
import { Grid } from 'semantic-ui-react'; // Dropdown,
import { addAppURL } from '@plone/volto/helpers';

import CaseStudyMap from './CaseStudyMap';
import CaseStudyFilters from './CaseStudyFilters';

import { filterCases, getFilters } from './utils';
import { useCases } from './hooks';

import './styles.less';

const cases_url = '@@case-studies-map.arcgis.json';

export default function CaseStudyExplorerView(props) {
  const casesData = useCases(addAppURL(cases_url));
  const [cases, setCases] = React.useState([]);

  const [activeFilters, setActiveFilters] = React.useState({
    sectors: [],
    impacts: [],
    measures: [],
  });

  const [activeItems, setActiveItems] = React.useState(cases);
  const [filters, setFilters] = React.useState({
    impacts: [],
    sectors: [],
    measures: {},
  });

  React.useEffect(() => {
    if (casesData.hasOwnProperty('features')) {
      const _cases = casesData.features;
      let _filters = filters;
      setCases(_cases);
      _filters.measures = casesData.filters.measures;
      setFilters(_filters);
    }
  }, [casesData, filters]);

  React.useEffect(() => {
    const _filters_data = getFilters(cases);
    let _filters = filters;
    _filters.impacts = _filters_data.impacts;
    _filters.sectors = _filters_data.sectors;
    setFilters(_filters);
  }, [
    filters,
    cases,
    activeFilters.impacts,
    activeFilters.sectors,
    activeFilters.measures,
    activeItems.length,
  ]);

  React.useEffect(() => {
    const activeItems = filterCases(cases, activeFilters);
    setActiveItems(activeItems);
  }, [activeFilters, cases]);

  if (__SERVER__) return '';

  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={9} tablet={9} computer={9} className="col-left">
          {cases.length ? (
            <CaseStudyMap items={cases} activeItems={activeItems} />
          ) : null}
        </Grid.Column>
        <Grid.Column
          mobile={3}
          tablet={3}
          computer={3}
          className="col-left"
          id="cse-filter"
        >
          <CaseStudyFilters
            filters={filters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
}

// import { useDispatch } from 'react-redux'; // , useSelector
// import { getVocabulary } from '@plone/volto/actions'; // , searchContent
// const IPCC = 'eea.climateadapt.aceitems_ipcc_category';
// const dispatch = useDispatch();
// React.useEffect(() => {
//   const action = getVocabulary({
//     vocabNameOrURL: IPCC,
//   });
//   dispatch(action);
// }, [dispatch]);
// setMapKey(
//   activeItems.length +
//     '-' +
//     activeFilters.sectors +
//     '-' +
//     activeFilters.impacts,
// );
//console.log('activeFilters filter cases', data);
// setMapKey(
//   activeItems.length +
//     '-' +
//     activeFilters.sectors +
//     '-' +
//     activeFilters.impacts,
// );
// const [mapKey, setMapKey] = React.useState('-');
