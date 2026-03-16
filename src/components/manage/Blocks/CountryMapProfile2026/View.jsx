import React from 'react';
import { compose } from 'redux';
import { Grid, Dropdown } from 'semantic-ui-react';
import {
  getImageUrl,
  tooltipStyle,
  adjustEuCountryNames,
  euCountryNamesIncludingEnergy as euCountryNamesRaw,
} from '@eeacms/volto-cca-policy/helpers/country_map/countryMap';
import { withGeoJsonData } from '@eeacms/volto-cca-policy/helpers/country_map/hocs';
import { clientOnly } from '@eeacms/volto-cca-policy/helpers';
import { withOpenLayers } from '@eeacms/volto-openlayers-map';
import { Map, Layer, Layers, Controls } from '@eeacms/volto-openlayers-map/api';
import { makeStyles } from './mapstyle';
import { Interactions } from './Interactions';
import { useCountriesMetadata } from './hooks';
import Filter from './Filter';
import withResponsiveContainer from '../withResponsiveContainer';
import withVisibilitySensor from '../withVisibilitySensor';
import { addAppURL } from '@plone/volto/helpers';
import { Callout } from '@eeacms/volto-eea-design-system/ui';

import './styles.less';

const View = (props) => {
  const { geofeatures, projection, ol } = props;
  const highlight = React.useRef();
  const [stateHighlight, setStateHighlight] = React.useState();
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const AUTOCOMPLETE_LIMIT = 4;

  const styles = React.useMemo(
    () => makeStyles(highlight, selectedCountry, ol),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stateHighlight, selectedCountry, ol],
  );
  const tooltipRef = React.useRef();
  const [tileWMSSources, setTileWMSSources] = React.useState();
  const [euCountriesSource, setEuCountriessource] = React.useState();
  const [thematicMapMode, setThematicMapMode] = React.useState(
    'National adaption policy',
  );
  const countries_metadata_url =
    '/en/countries-regions/countries/@@countries-metadata-extract-2025?langflag=1';
  const countries_metadata = useCountriesMetadata(
    addAppURL(countries_metadata_url),
  );

  const euCountryNames = adjustEuCountryNames(euCountryNamesRaw);
  const countryOptions = [
    { key: 'none', value: '', text: 'Select a country' },
    ...euCountryNames
      .map((name) => ({
        key: name,
        value: name,
        text: name,
      }))
      .sort((a, b) => a.text.localeCompare(b.text)),
  ];

  const autocompleteOptions = React.useMemo(() => {
    if (searchQuery.length < 3) return [];
    return countryOptions
      .filter(
        (opt) =>
          opt.value &&
          opt.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, AUTOCOMPLETE_LIMIT);
  }, [countryOptions, searchQuery]);

  const [isLegendExpanded, setIsLegendExpanded] = React.useState(false);

  const euCountryFeatures = React.useRef();

  React.useEffect(() => {
    const features = new ol.format.GeoJSON().readFeatures(geofeatures, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    const filtered = features.filter((f) =>
      euCountryNames.includes(f.get('na')),
    );

    euCountryFeatures.current = filtered;

    filtered.forEach((feature) => {
      const img = new Image();
      img.onload = function () {
        feature.set('flag', img);
      };
      img.src = getImageUrl(feature);
    });

    const euSource = new ol.source.Vector({ features: filtered });
    setEuCountriessource(euSource);

    setTileWMSSources([
      new ol.source.TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/service',
        params: {
          LAYERS: 'OSMBrightBackground',
          TILED: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
    ]);
  }, [geofeatures, countries_metadata, thematicMapMode, euCountryNames, ol]);

  const baseUrl = props.path || props.location?.pathname || '';

  const selectedFeature = euCountryFeatures.current?.find(
    (f) => f.get('na') === selectedCountry,
  );
  const flagUrl = selectedFeature?.get('flag')?.src;
  const metadata = countries_metadata?.[0]?.[selectedCountry]?.[0];

  const renderAdopted = (html) => {
    if (!html) return 'No data reported';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const lis = doc.querySelectorAll('li');
    const adoptedItems = Array.from(lis).filter((li) => {
      const p = li.querySelector('p');
      return p && p.textContent.trim().toLowerCase() === 'adopted';
    });

    if (adoptedItems.length === 0) return 'No data reported';

    return adoptedItems.map((li, idx) => {
      const a = li.querySelector('a');
      const p = li.querySelector('p');
      return (
        <div key={idx} className="adopted-item">
          {a ? (
            <a href={a.href} target="_blank" rel="noreferrer">
              {a.textContent}
            </a>
          ) : (
            <span>{li.textContent.replace(p.textContent, '')}</span>
          )}
          <p className="status">{p.textContent}</p>
        </div>
      );
    });
  };

  return (
    <div className="ol-country-map" id="countryMapProfileBlock">
      <Callout>
        <p>
          Explore insights on Europe's climate adaptation progress. In 2025, EU
          Member States, EEA Member Countries and Energy Community Contracting
          Parties submitted their reports under Article 19 of the Regulation
          (EU) 2018/1999 on the Governance of the Energy Union and Climate
          Action and the adapted Governance Regulation (2018/1999) as
          incorporated and adapted by the Energy Community Ministerial Council
          decision 2021/14/mc-enc. Requirements are outlined in Annex I of the
          Implementing Regulation (2020/1208) and the Energy Community adapted
          Implementing Regulation (2020/1208).
        </p>
      </Callout>
      <h2>Climate-ADAPT country profiles</h2>
      <p>
        Explore each country's National Adaptation Strategy (NAS) and National
        Adaptation Plan (NAP) status, or click “View country profile” to see all
        adaptation policies and actions.
      </p>

      <Grid columns={2} stackable className="country-selectors">
        <Grid.Column>
          <Dropdown
            placeholder="Search country"
            fluid
            search
            selection
            clearable
            options={autocompleteOptions}
            value={selectedCountry}
            searchQuery={searchQuery}
            onSearchChange={(e, { searchQuery }) => setSearchQuery(searchQuery)}
            onChange={(e, { value }) => {
              setSelectedCountry(value);
              setSearchQuery('');
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <Dropdown
            placeholder="Select country"
            fluid
            selection
            clearable
            options={countryOptions}
            value={selectedCountry}
            onChange={(e, { value }) => setSelectedCountry(value)}
          />
        </Grid.Column>
      </Grid>

      {tileWMSSources ? (
        <Map
          view={{
            center: ol.proj.fromLonLat([14.5, 57], projection),
            projection,
            showFullExtent: true,
            zoom: 3.3,
          }}
          pixelRatio={1}
        >
          <div
            ref={tooltipRef}
            style={tooltipStyle}
            className="map-tooltip"
          ></div>

          {selectedCountry && (
            <div className="country-info-panel">
              <div className="panel-header">
                <div className="header-top">
                  <div className="country-title">
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt={selectedCountry}
                        className="panel-flag"
                      />
                    )}
                    <h3>{selectedCountry}</h3>
                  </div>
                  <a
                    href={`/en/countries-regions/countries/${selectedCountry.toLowerCase()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="view-profile-link"
                  >
                    View {selectedCountry}'s profile
                  </a>
                </div>
              </div>
              <div className="panel-content">
                <Grid columns={2} divided>
                  <Grid.Column>
                    <h4>National Adaptation Strategy (NAS)</h4>
                    <div className="metadata-content">
                      {renderAdopted(metadata?.nas_mixed)}
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <h4>National Adaptation Plan (NAP)</h4>
                    <div className="metadata-content">
                      {renderAdopted(metadata?.nap_mixed)}
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            </div>
          )}

          <div className="map-legend-wrapper">
            <div
              className="map-legend-label"
              onClick={() => setIsLegendExpanded(!isLegendExpanded)}
            >
              Legend {isLegendExpanded ? '▲' : '▲'}
            </div>
            {isLegendExpanded && (
              <div className="map-legend-items">
                <div className="legend-item">
                  <span className="country-eea-eu-member legend-box"></span>
                  <span>EU Member States and EEA Member Countries</span>
                </div>
                <div className="legend-item">
                  <span className="country-eea-member legend-box"></span>
                  <span>EU Member Countries</span>
                </div>
                <div className="legend-item">
                  <span className="country-eea-coopereting legend-box"></span>
                  <span>
                    EEA Cooperating Countries and Energy Community Contracting
                    Parties
                  </span>
                </div>
                <div className="legend-item">
                  <span className="country-eastern legend-box"></span>
                  <span>Energy Community Contracting Parties</span>
                </div>
              </div>
            )}
          </div>
          <Controls attribution={false} />
          <Layers>
            {props.mode !== 'edit' && (
              <Interactions
                ol={ol}
                tooltipRef={tooltipRef}
                countries_metadata={countries_metadata}
                baseUrl={baseUrl}
                thematicMapMode={thematicMapMode}
                euCountryFeatures={euCountryFeatures}
                highlight={highlight}
                setStateHighlight={setStateHighlight}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
            )}
            <Layer.Vector
              source={euCountriesSource}
              zIndex={7}
              style={styles.eucountriesStyle}
            />
            {selectedCountry && (
              <Layer.Vector
                key={`highlight-${selectedCountry}`}
                source={euCountriesSource}
                zIndex={8}
                style={styles.highlightedCountryStyle}
              />
            )}
            <Layer.Tile source={tileWMSSources[0]} zIndex={0} />
          </Layers>
        </Map>
      ) : null}
      <Grid columns="12" className="countryProfileNumbers">
        <Grid.Column mobile={4} tablet={4} computer={4} className="col-left">
          <h3>37</h3>
          <p>
            Climate-ADAPT
            <br />
            country profiles
          </p>
        </Grid.Column>
        <Grid.Column mobile={4} tablet={4} computer={4} className="col-left">
          <h3>21</h3>
          <p>
            Countries adopted
            <br />
            National Adaptation Strategy (NAS)
          </p>
        </Grid.Column>
        <Grid.Column mobile={4} tablet={4} computer={4} className="col-left">
          <h3>18</h3>
          <p>
            Countries adopted
            <br />
            National Adaptation Plan (NAP)
          </p>
        </Grid.Column>
      </Grid>
      <h2>Legend for the climate-ADAPT country profiles map</h2>
      <p>
        The colors on the map represent the different country groups involved in
        reporting on national adaptation actions under the Governance Regulation
        on the Energy Union and Climate Action (2018/1999) and related
        processes, distinguishing between those that have a legal obligation to
        report and those that report on a voluntary basis.
      </p>
      <table>
        <thead>
          <tr>
            <th>Group</th>
            <th>Reporting status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="country-eea-eu-member legend-box"></span>EU
              Member States and EEA Member Countries
            </td>
            <td>Mandatory reporting</td>
            <td>
              Required to report unde the Governance Regulation (2018/1999)
            </td>
          </tr>
          <tr>
            <td>
              <span className="country-eea-member legend-box"></span>EU Member
              Countries
            </td>
            <td>Voluntary reporting</td>
            <td>Reporting on a voluntary basis.</td>
          </tr>
          <tr>
            <td>
              <span className="country-eea-coopereting legend-box"></span>EEA
              Cooperating Countries and Energy Community Contracting Parties
              <br />
              <span className="country-eastern legend-box"></span>Energy
              Community Contracting Parties
            </td>
            <td>Mandatory reporting</td>
            <td>
              Required to report under the adapted Governance Regulation
              (2018/1999).
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default compose(
  clientOnly,
  withGeoJsonData(true),
  withResponsiveContainer('countryMapProfileBlock'),
  withVisibilitySensor(),
  withOpenLayers,
)(View);
