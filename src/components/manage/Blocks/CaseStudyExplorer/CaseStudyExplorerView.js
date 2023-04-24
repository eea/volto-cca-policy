import React from 'react';
import { Grid } from 'semantic-ui-react'; // Dropdown,
// import { useDispatch } from 'react-redux'; // , useSelector

// import { getVocabulary } from '@plone/volto/actions'; // , searchContent
import { addAppURL } from '@plone/volto/helpers';

import CaseStudyMap from './CaseStudyMap';
import CaseStudyFilters from './CaseStudyFilters';

import { filterCases, getFilters } from './utils';
import { useCases } from './hooks';

import './styles.less';

const cases_url = '@@case-studies-map.arcgis.json';

// const IPCC = 'eea.climateadapt.aceitems_ipcc_category';
// const dispatch = useDispatch();
// React.useEffect(() => {
//   const action = getVocabulary({
//     vocabNameOrURL: IPCC,
//   });
//   dispatch(action);
// }, [dispatch]);

export default function CaseStudyExplorerView(props) {
  const cases = useCases(addAppURL(cases_url));
  // const [mapKey, setMapKey] = React.useState('-');

  const [activeFilters, setActiveFilters] = React.useState({
    sectors: [],
    impacts: [],
  });

  const [activeItems, setActiveItems] = React.useState(cases);
  const [filters, setFilters] = React.useState([]);

  React.useEffect(() => {
    const _filters = getFilters(cases);
    setFilters(_filters);
    // setMapKey(
    //   activeItems.length +
    //     '-' +
    //     activeFilters.sectors +
    //     '-' +
    //     activeFilters.impacts,
    // );
  }, [cases, activeFilters.impacts, activeFilters.sectors, activeItems.length]);

  React.useEffect(() => {
    const data = filterCases(cases, activeFilters);
    setActiveItems(data);

    //console.log('activeFilters filter cases', data);
    // setMapKey(
    //   activeItems.length +
    //     '-' +
    //     activeFilters.sectors +
    //     '-' +
    //     activeFilters.impacts,
    // );
  }, [activeFilters, cases]);

  if (__SERVER__) return '';

  //console.log('ACTIVE FILTERS', activeFilters);
  //console.log(mapKey);

  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={9} tablet={9} computer={10} className="col-left">
          <CaseStudyMap cases={activeItems} filters={activeFilters} />
        </Grid.Column>
        <Grid.Column
          mobile={3}
          tablet={3}
          computer={2}
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
