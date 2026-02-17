import { Fragment } from 'react';
import { Popup, Segment } from 'semantic-ui-react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';
import {
  ACE_COUNTRIES,
  BIOREGIONS,
  SUBNATIONAL_REGIONS,
} from '@eeacms/volto-cca-policy/helpers';
import {
  VIDEO,
  GUIDANCE,
  INDICATOR,
  PUBLICATION_REPORT,
} from '@eeacms/volto-cca-policy/helpers/Constants';
import { MetadataItemList } from '@eeacms/volto-cca-policy/helpers';
import { UniversalLink } from '@plone/volto/components';

const messages = defineMessages({
  default_info_tooltip: {
    id:
      'The date refers to the moment in which the item has been prepared ' +
      'or updated by contributing experts to be submitted for the publication ' +
      'in Climate ADAPT',
    defaultMessage:
      'The date refers to the moment in which the item has been prepared ' +
      'or updated by contributing experts to be submitted for the publication ' +
      'in Climate ADAPT',
  },
  release_info_tooltip: {
    id: 'The date refers to the date of release of the video',
    defaultMessage: 'The date refers to the date of release of the video',
  },
  publication_info_tooltip: {
    id: 'The date refers to the latest date of publication of the item',
    defaultMessage:
      'The date refers to the latest date of publication of the item',
  },
  release_date: {
    id: 'Date of release:',
    defaultMessage: 'Date of release:',
  },
  publication_date: {
    id: 'Date of publication:',
    defaultMessage: 'Date of publication:',
  },
  creation_date: {
    id: 'Date of creation:',
    defaultMessage: 'Date of creation:',
  },
  'Macro-Transnational region:': {
    id: 'Macro-Transnational region:',
    defaultMessage: 'Macro-Transnational region:',
  },
  'Biogeographical regions:': {
    id: 'Biogeographical regions:',
    defaultMessage: 'Biogeographical regions:',
  },
  'Countries:': { id: 'Countries:', defaultMessage: 'Countries:' },
  'Sub Nationals:': { id: 'Sub Nationals:', defaultMessage: 'Sub Nationals:' },
  'City:': { id: 'City:', defaultMessage: 'City:' },
});

function renderElement(value) {
  return [BIOREGIONS[value]];
}

function renderBiotrans(value) {
  if (value === null) {
    return null;
  }
  let out = [];
  let temp = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  } else {
    temp = BIOREGIONS[value];
    if (temp !== undefined) {
      return [temp];
    } else {
      return [value];
    }
  }
  for (let region of value) {
    temp = BIOREGIONS[region];
    if (temp !== undefined) {
      out.push(temp);
    } else {
      out.push(region);
    }
  }
  return out;
}

function renderCountries(value) {
  let out = [];
  let temp = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  } else {
    temp = ACE_COUNTRIES[value];
    if (temp !== undefined) {
      return [temp];
    } else {
      return [value];
    }
  }
  for (let region of value) {
    temp = ACE_COUNTRIES[region];
    if (temp !== undefined) {
      out.push(temp);
    } else {
      out.push(region);
    }
  }
  return out;
}

function renderSubnational(value) {
  let out = [];
  let temp = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
  } else {
    temp = SUBNATIONAL_REGIONS[value];
    if (temp !== undefined) {
      return [temp];
    } else {
      return [value];
    }
  }
  for (let region of value) {
    temp = SUBNATIONAL_REGIONS[region];
    if (temp !== undefined) {
      out.push(temp);
    } else {
      // Show only defined terms, or show all (including missing IDs):
      // out.push(region);
    }
  }
  return out;
}

function renderCity(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }
    return value;
  } else {
    if (value.length === 0) {
      return null;
    }
    let out = [];
    out.push(value);
    return out;
  }
}

function renderSection(value, valueType) {
  if (valueType === 'element') {
    return renderElement(value);
  }

  if (valueType === 'macrotrans') {
    return renderBiotrans(value);
  }

  if (valueType === 'biotrans') {
    return renderBiotrans(value);
  }

  if (valueType === 'countries') {
    return renderCountries(value);
  }

  if (valueType === 'subnational') {
    return renderSubnational(value);
  }

  if (valueType === 'city') {
    return renderCity(value);
  }
  return null;
}

function renderGeochar(geoElements, isObservatoryPage = false) {
  if (!geoElements) {
    return null;
  }

  let out = [];
  let orderedSections = [
    'element',
    'macrotrans',
    'biotrans',
    'countries',
    'subnational',
    'city',
  ];

  const sectionTitles = {
    element: null,
    macrotrans: 'Macro-Transnational region:',
    biotrans: 'Biogeographical regions:',
    countries: 'Countries:',
    subnational: 'Sub Nationals:',
    city: 'City:',
  };

  if (isObservatoryPage) {
    orderedSections = ['element', 'macrotrans'];
  }

  for (let key of orderedSections) {
    let section = geoElements[key];

    if (section !== undefined) {
      let rendered = renderSection(section, key);
      out[key] = out.push({
        title: sectionTitles[key],
        value: rendered,
      });
    }
  }

  return out;
}

function GeoChar(props) {
  const { content } = props;
  const { spatial_values, spatial_layer, geochars } = content;
  const j = JSON.parse(geochars);
  const intl = useIntl();

  if (j === null) {
    if (spatial_layer) {
      return (
        <div className="geochar">
          <p>{spatial_layer}</p>
          <h5>
            <FormattedMessage id="Countries:" defaultMessage="Countries:" />
          </h5>
          {spatial_values && spatial_values.length > 0 && (
            <p>
              {spatial_values
                .map((item) => item.token)
                .map((token) =>
                  intl.formatMessage({
                    id: token,
                    defaultMessage: token,
                  }),
                )
                .join(', ')}
            </p>
          )}
        </div>
      );
    }

    return '';
  }

  const { geoElements } = j;

  let rendered = renderGeochar(geoElements);

  return (
    <div className="geochar">
      {rendered.map(
        (section, index) =>
          section.value && (
            <Fragment key={index}>
              {section.title && (
                <h5>{intl.formatMessage(messages[section.title])}</h5>
              )}
              <p>
                {section.value
                  .map((countryName) =>
                    intl.formatMessage({
                      id: countryName,
                      defaultMessage: countryName,
                    }),
                  )
                  .join(', ')}
              </p>
            </Fragment>
          ),
      )}
    </div>
  );
}

function PublicationDateInfo({ value, portaltype, title }) {
  const intl = useIntl();
  const publicationYear = new Date(value).getFullYear();

  const tooltipMessages = {
    [VIDEO]: intl.formatMessage(messages.release_info_tooltip),
    [GUIDANCE]: intl.formatMessage(messages.publication_info_tooltip),
    [INDICATOR]: intl.formatMessage(messages.publication_info_tooltip),
    [PUBLICATION_REPORT]: intl.formatMessage(messages.publication_info_tooltip),
    default: intl.formatMessage(messages.default_info_tooltip),
  };

  const tooltipText = tooltipMessages[portaltype] || tooltipMessages.default;

  if (publicationYear <= 1970) return null;

  return (
    <>
      <h5>{title}</h5>
      <p>
        {publicationYear}
        <Popup
          content={tooltipText}
          trigger={<i className="ri-question-fill"></i>}
        />
      </p>
    </>
  );
}

function ContentMetadata(props) {
  const intl = useIntl();
  const { content, related_case_studies } = props;
  const {
    sectors,
    geochars,
    keywords,
    elements,
    duration,
    spatial_layer,
    ipcc_category,
    health_impacts,
    climate_impacts,
    governance_level,
    key_type_measures,
    funding_programme,
    include_in_observatory,
  } = content;
  const type = content['@type'];

  const hasGeoChars = geochars !== null || spatial_layer.length > 0;

  const dateTitles = {
    [VIDEO]: intl.formatMessage(messages.release_date),
    [PUBLICATION_REPORT]: intl.formatMessage(messages.publication_date),
    [INDICATOR]: intl.formatMessage(messages.publication_date),
    [GUIDANCE]: intl.formatMessage(messages.publication_date),
    default: intl.formatMessage(messages.creation_date),
  };

  const dateTitle = dateTitles[type] || dateTitles.default;

  return (
    <>
      <Segment className="content-metadata">
        <PublicationDateInfo
          title={dateTitle}
          value={content?.publication_date}
          portaltype={type}
        />

        {related_case_studies?.length > 0 && (
          <>
            <h5>
              <FormattedMessage
                id="Case studies related to this option:"
                defaultMessage="Case studies related to this option:"
              />
            </h5>
            <ul className="related-case-studies">
              {related_case_studies.map((item, index) => (
                <li key={index}>
                  <UniversalLink key={index} href={item.url}>
                    {item.title}
                  </UniversalLink>
                </li>
              ))}
            </ul>
          </>
        )}

        {keywords && keywords?.length > 0 && (
          <>
            <h5>
              <FormattedMessage id="Keywords:" defaultMessage="Keywords:" />
            </h5>
            <span>{keywords?.sort().join(', ')}</span>
          </>
        )}

        {key_type_measures && key_type_measures?.length > 0 && (
          <>
            <div
              style={{ display: 'flex', alignItems: 'start', marginTop: '1em' }}
            >
              <h5>
                <FormattedMessage
                  id="Key Type Measures:"
                  defaultMessage="Key Type Measures:"
                />
              </h5>
              <Popup
                content={
                  <FormattedMessage
                    id="Key Type Measures (KTMs) are a common approach for grouping and classifying climate change adaptation actions and measures, supporting harmonized reporting, comparability, and systematic analysis across adaptation policies and governance levels."
                    defaultMessage="Key Type Measures (KTMs) are a common approach for grouping and classifying climate change adaptation actions and measures, supporting harmonized reporting, comparability, and systematic analysis across adaptation policies and governance levels."
                  />
                }
                trigger={<i className="ri-question-fill"></i>}
              />
            </div>
            <MetadataItemList value={key_type_measures} />
          </>
        )}

        {ipcc_category && ipcc_category?.length > 0 && (
          <>
            <h5>
              <FormattedMessage
                id="IPCC adaptation options categories:"
                defaultMessage="IPCC adaptation options categories:"
              />
            </h5>
            <MetadataItemList value={ipcc_category} />
          </>
        )}

        {climate_impacts && climate_impacts?.length > 0 && (
          <>
            <h5>
              <FormattedMessage
                id="Climate impacts:"
                defaultMessage="Climate impacts:"
              />
            </h5>
            <MetadataItemList value={climate_impacts} />
          </>
        )}

        {elements && elements?.length > 0 && (
          <>
            <h5>
              <FormattedMessage
                id="Adaptation Approaches:"
                defaultMessage="Adaptation Approaches:"
              />
            </h5>
            <MetadataItemList value={elements} />
          </>
        )}

        {sectors && sectors?.length > 0 && (
          <>
            <h5>
              <FormattedMessage id="Sectors:" defaultMessage="Sectors:" />
            </h5>
            <MetadataItemList value={sectors} />
          </>
        )}

        {governance_level && governance_level?.length > 0 && (
          <>
            <h5>
              <FormattedMessage
                id="Governance level:"
                defaultMessage="Governance level:"
              />
            </h5>
            <MetadataItemList value={governance_level} join_type="<br />" />
          </>
        )}

        {funding_programme && funding_programme?.title?.length > 0 && (
          <>
            <h5>
              <FormattedMessage
                id="Funding Programme:"
                defaultMessage="Funding Programme:"
              />
            </h5>
            <span>{funding_programme.title}</span>
          </>
        )}

        {duration && (
          <>
            <h5>
              <FormattedMessage id="Duration:" defaultMessage="Duration:" />
            </h5>
            <span>{duration}</span>
          </>
        )}

        {hasGeoChars && (
          <>
            <h5>
              <FormattedMessage
                id="Geographic characterisation:"
                defaultMessage="Geographic characterisation:"
              />
            </h5>
            <GeoChar {...props} />
          </>
        )}
      </Segment>

      {include_in_observatory &&
        health_impacts &&
        health_impacts?.length > 0 && (
          <Segment className="content-metadata">
            <h5>
              <FormattedMessage
                id="Health impact:"
                defaultMessage="Health impact:"
              />
            </h5>
            <MetadataItemList value={health_impacts} />
          </Segment>
        )}
    </>
  );
}

export default ContentMetadata;
