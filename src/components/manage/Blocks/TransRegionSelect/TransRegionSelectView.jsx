import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { getQueryStringResults } from '@plone/volto/actions';
import regionCountries from './countries.json';

const getSiblings = (items) => {
  const regionsDropdown = (items || []).map((item) => {
    return {
      key: item.title,
      value: item.title,
      text: item.title,
      as: Link,
      to: item['@id'],
    };
  });

  regionsDropdown.sort((a, b) =>
    a.text < b.text ? -1 : a.text > b.text ? 1 : 0,
  );

  return regionsDropdown;
};

export default function TransRegionSelectView(props) {
  const { id, data } = props;
  const content = useSelector((state) => state.content.data);
  const { title } = content;
  const dispatch = useDispatch();
  const querystringResults = useSelector(
    (state) => state.querystringsearch.subrequests,
  );
  const currentLang = useSelector((state) => state.intl.locale);
  const regions = getSiblings(querystringResults[id]?.items);
  const otherRegionsCoverTitle =
    'EU outermost regions and the overseas countries and territories';

  React.useEffect(() => {
    dispatch(
      getQueryStringResults(
        '/',
        {
          b_start: 0,
          b_size: 10000,
          limit: 10000,
          query: [
            {
              i: 'path',
              o: 'plone.app.querystring.operation.string.relativePath',
              v: '/en/countries-regions/transnational-regions/::1',
            },
            {
              i: 'object_provides',
              o: 'plone.app.querystring.operation.selection.any',
              v: 'eea.climateadapt.interfaces.ITransnationalRegionMarker',
            },
            {
              i: 'review_state',
              o: 'plone.app.querystring.operation.selection.any',
              v: 'published',
            },
          ],
        },
        id,
      ),
    );
  }, [dispatch, id]);

  const defaultValue =
    title === otherRegionsCoverTitle ? 'Other regions' : title;

  return (
    <div className="block">
      {data.title && <h5>{data.title}</h5>}
      <Dropdown
        selection
        text="Choose a region"
        options={regions}
        defaultValue={defaultValue}
        icon="angle down"
      />
      <p></p>
      <div className="countries">
        {title === otherRegionsCoverTitle ||
        title === 'Other regions' ? null : (
          <h5>Region's countries:</h5>
        )}
        {regionCountries.countries
          .filter((item) => item.region === title)
          .map((item, i) => (
            <div className="countries-listing" key={i}>
              {item.countries.map((country, i) => {
                const url = `/${currentLang}${country[1]}`;
                return (
                  <React.Fragment key={i}>
                    {country[1].length > 0 ? (
                      <Link to={url}>
                        <span>
                          {country[0]}
                          {i < item.countries.length - 1 ? ', ' : ''}
                        </span>
                      </Link>
                    ) : (
                      <span>
                        {country[0]}
                        {i < item.countries.length - 1 ? ', ' : ''}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
}
