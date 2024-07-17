import React from 'react';
import { Grid } from 'semantic-ui-react'; // Dropdown,
import { addAppURL } from '@plone/volto/helpers';

import CaseStudyMap from './CaseStudyMap';
import CaseStudyFilters from './CaseStudyFilters';

import { filterCases, getFilters } from './utils';
import { useCases } from './hooks';

import './styles.less';

import { useLocation } from 'react-router-dom';

const cases_url = '@@case-studies-map.arcgis.json';

export default function CaseStudyExplorerView(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const querySectorValue = searchParams.get('sectors')
    ? searchParams.get('sectors').split(',')
    : [];

  const casesData = useCases(addAppURL(cases_url));
  const [cases, setCases] = React.useState([]);

  const [querySectors, setQuerySectors] = React.useState(querySectorValue);
  const [activeFilters, setActiveFilters] = React.useState({
    sectors: querySectorValue,
    impacts: [],
    elements: [],
    measures: [],
  });

  const [activeItems, setActiveItems] = React.useState(cases);
  const [filters, setFilters] = React.useState({
    impacts: [],
    elements: [],
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
    _filters.elements = _filters_data.elements;
    setFilters(_filters);
  }, [
    filters,
    cases,
    activeFilters.impacts,
    activeFilters.sectors,
    activeFilters.elements,
    activeFilters.measures,
    activeItems.length,
  ]);

  React.useEffect(() => {
    const activeItems = filterCases(cases, activeFilters);
    setActiveItems(activeItems);
  }, [activeFilters, cases]);

  if (__SERVER__) return '';

  return (
    <div className="casestudy-explorer-map">
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
            querySectors={querySectors}
            setQuerySectors={setQuerySectors}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
}
