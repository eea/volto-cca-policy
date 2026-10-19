import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Popup, Segment } from 'semantic-ui-react';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import {
  // CONTENT_TYPE_LABELS,
  GUIDANCE,
  INDICATOR,
  PUBLICATION_REPORT,
  VIDEO,
} from '@eeacms/volto-cca-policy/constants';
import GeographicMetadata from './GeographicMetadata';
import LinkedMetadataItemList from './LinkedMetadataItemList';
import MetadataItemList from './MetadataItemList';
import PublicationDateInfo from './PublicationDateInfo';

const messages = defineMessages({
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
});

const ContentMetadata = (props) => {
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
  // const contentTypeLabel = CONTENT_TYPE_LABELS[type];

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
            <LinkedMetadataItemList
              value={[...keywords].sort((a, b) =>
                a.toLowerCase().localeCompare(b.toLowerCase()),
              )}
              // contentType={contentTypeLabel}
              asInline
            />
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
            <LinkedMetadataItemList
              value={key_type_measures}
              field="cca_key_type_measure.keyword"
              // contentType={contentTypeLabel}
              getSearchValue={(item) => item.token || item.title || item}
            />
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
            <LinkedMetadataItemList
              value={ipcc_category}
              field="cca_ipcc_category.keyword"
              // contentType={contentTypeLabel}
            />
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
            <LinkedMetadataItemList
              value={climate_impacts}
              field="cca_climate_impacts.keyword"
              // contentType={contentTypeLabel}
            />
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
            <LinkedMetadataItemList
              value={elements}
              field="cca_adaptation_elements.keyword"
              // contentType={contentTypeLabel}
            />
          </>
        )}

        {sectors && sectors?.length > 0 && (
          <>
            <h5>
              <FormattedMessage id="Sectors:" defaultMessage="Sectors:" />
            </h5>
            <LinkedMetadataItemList
              value={sectors}
              field="cca_adaptation_sectors.keyword"
              // contentType={contentTypeLabel}
            />
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
            <LinkedMetadataItemList
              value={governance_level}
              field="cca_governance_level_list.keyword"
              // contentType={contentTypeLabel}
              asList
            />
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
            <LinkedMetadataItemList
              value={[funding_programme]}
              field="cca_funding_programme.keyword"
              // contentType={contentTypeLabel}
              getSearchValue={(item) => item.token || item.title || item}
            />
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
            <GeographicMetadata {...props} />
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
};

export default ContentMetadata;
