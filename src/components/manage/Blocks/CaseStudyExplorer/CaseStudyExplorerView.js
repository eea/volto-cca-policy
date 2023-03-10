import React from 'react';
import superagent from 'superagent';
import { addAppURL } from '@plone/volto/helpers';
import { Dropdown, Grid } from 'semantic-ui-react';
import { getVocabulary, searchContent } from '@plone/volto/actions';
//import ECDEIndicator from './ECDEIndicator';
import { useDispatch, useSelector } from 'react-redux';

// const cases_url =
//   'http://localhost:3000/en/mkh/case-studies-map-arcgis.json/@@download/file';
const cases_url = '@@case-studies-map.arcgis.json';
const IPCC = 'eea.climateadapt.aceitems_ipcc_category';

function useCases(url) {
  const [cases, setCases] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(cases_url)
      .set('accept', 'json')
      .then((resp) => {
        const res = JSON.parse(resp.text);
        setCases(res.features);
      });
  }, []);

  return cases;
}

function useFilters() {
  const [filters, setFilters] = React.useState([]);
}

export default function CaseStudyExplorerView(props) {
  // console.log(regions);
  const cases = useCases(addAppURL(cases_url));

  //const filters = useFilters();
  const [filters, setFilters] = React.useState([]);
  const dispatch = useDispatch();
  const ipcc_categories = useSelector(
    (state) => state.vocabularies?.[IPCC]?.items,
  );

  React.useEffect(() => {
    const action = getVocabulary({
      vocabNameOrURL: IPCC,
    });
    dispatch(action);
  }, [dispatch]);

  React.useEffect(() => {
    let _filters = { sectors: {}, impacts: {} };

    // console.log('acis', typeof cases, cases[0], cases);
    // console.log(Object.keys(cases));
    for (var key of Object.keys(cases)) {
      // console.log(key, cases[key]);
      var _case = cases[key];
      let sectorKeys = _case.properties.sectors.split(',');
      let sectorNames = _case.properties.sectors_str.split(',');
      for (var i = 0; i < sectorNames.length; i++) {
        if (!_filters.sectors.hasOwnProperty(sectorKeys[i + 1])) {
          _filters.sectors[sectorKeys[i + 1]] = sectorNames[i];
        }
      }
      let impactKeys = _case.properties.impacts.split(',');
      let impactNames = _case.properties.impacts_str.split(',');
      for (i = 0; i < impactNames.length; i++) {
        if (!_filters.impacts.hasOwnProperty(impactKeys[i + 1])) {
          _filters.impacts[impactKeys[i + 1]] = impactNames[i];
        }
      }
    }
    setFilters(_filters);
  }, [cases]);

  const [activeFilters, setActiveFilters] = React.useState({});

  console.log({ ipcc_categories, filters });

  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={10} className="col-left">
          MAP HERE
        </Grid.Column>
        <Grid.Column mobile={12} tablet={12} computer={2} className="col-left">
          {Object.entries(filters?.sectors || {}).map(
            ([value, label], index) => (
              <div key={index}>
                <input
                  value={value}
                  type="checkbox"
                  onChange={(e) => {
                    // const value =
                    console.log(e.target.checked);
                    // setActiveFilters({...activeFilters, sector: [...activeFilters
                  }}
                />
                <span>{label}</span>
              </div>
            ),
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
}
