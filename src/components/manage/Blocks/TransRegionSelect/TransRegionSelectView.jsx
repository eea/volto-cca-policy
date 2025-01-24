import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';

const messages = defineMessages({
  chooseARegion: {
    id: 'Choose a region',
    defaultMessage: 'Choose a region',
  },
  otherRegions: {
    id: 'Other regions',
    defaultMessage: 'Other regions',
  },
});

const getOptions = (items) => {
  const regionsDropdown = (items || []).map((item) => {
    return {
      key: item.title,
      value: item.title,
      text: item.title,
      as: Link,
      to: flattenToAppURL(item.url),
    };
  });

  regionsDropdown.sort((a, b) =>
    a.text < b.text ? -1 : a.text > b.text ? 1 : 0,
  );

  return regionsDropdown;
};

export default function TransRegionSelectView(props) {
  const intl = useIntl();
  const { data, metadata, properties, mode = 'view' } = props;
  const content = metadata || properties;
  if (mode === 'edit') {
    return <div>TransRegionSelectView: {data.region}</div>;
  }
  const { title } = content;
  const { regions, countries: countriesAndFlag } =
    content['@components']['transnationalregion'] || data._v_ || {};
  const [countries] = countriesAndFlag || [];

  console.log(regions, countries);

  const defaultValue = !!countries
    ? title
    : intl.formatMessage(messages.otherRegions);

  return (
    <div className="block">
      {data.title && <h5>{data.title}</h5>}
      <Dropdown
        selection
        text={intl.formatMessage(messages.chooseARegion)}
        options={getOptions(regions)}
        defaultValue={defaultValue}
        icon="angle down"
      />
      <p></p>
      <div className="countries">
        {!!countries && (
          <h5>
            <FormattedMessage
              id="Region's countries:"
              defaultMessage="Region's countries:"
            />
          </h5>
        )}
        <div className="countries-listing">
          {countries?.map(([name, url], i) => {
            return url ? (
              <React.Fragment key={i}>
                <Link to={url}>
                  <span>
                    {name}
                    {i < countries.length - 1 ? ', ' : ''}
                  </span>
                </Link>
              </React.Fragment>
            ) : (
              <span>
                {name}
                {i < countries.length - 1 ? ', ' : ''}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
