import React from 'react';
import superagent from 'superagent';
import { Dropdown, Grid } from 'semantic-ui-react';
import { searchContent } from '@plone/volto/actions';
//import ECDEIndicator from './ECDEIndicator';
import { useDispatch, useSelector } from 'react-redux';

const cases_url =
  'http://localhost:3000/en/mkh/case-studies-map-arcgis.json/@@download/file';

function useCases() {
  const [cases, setCases] = React.useState([]);

  React.useEffect(() => {
    superagent
      .get(cases_url)
      .set('accept', 'json')
      .then((resp) => {
        console.log('RESPONSE');
        const res = JSON.parse(resp.text);
        console.log(res.features);
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
  const cases = useCases();
  //const filters = useFilters();
  const [filters, setFilters] = React.useState([]);

  React.useEffect(() => {
    let _filters = { sectors: {}, impacts: {} };

    console.log('acis', typeof cases, cases[0], cases);
    console.log(Object.keys(cases));
    for (var key of Object.keys(cases)) {
      console.log(key, cases[key]);
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
    console.log(_filters);
  }, [cases]);

  return (
    <div>
      <Grid columns="12">
        <Grid.Column mobile={12} tablet={12} computer={10} className="col-left">
          MAP HERE
        </Grid.Column>
        <Grid.Column mobile={12} tablet={12} computer={2} className="col-left">
          {/*
          {Object.entries(filters.sectors).map((item, index) => (
            <div key={index}>
              <input value={index} type="checkbox" />
              <span>{item}</span>
            </div>
          ))}*/}
        </Grid.Column>
      </Grid>
    </div>
  );
}
