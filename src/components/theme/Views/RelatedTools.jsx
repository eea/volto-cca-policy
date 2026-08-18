import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { Icon, Container } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  relatedTools: {
    id: 'Related tools',
    defaultMessage: 'Related tools',
  },
  description: {
    id: 'Tools sharing a sector, hazard or cycle step with this one — useful next steps for the same question.',
    defaultMessage:
      'Tools sharing a sector, hazard or cycle step with this one — useful next steps for the same question.',
  },
  sameSector: {
    id: 'Same sector',
    defaultMessage: 'Same sector',
  },
  sharedHazard: {
    id: 'Shared hazard',
    defaultMessage: 'Shared hazard',
  },
  sameCycleStep: {
    id: 'Same cycle step',
    defaultMessage: 'Same cycle step',
  },
  view: {
    id: 'View',
    defaultMessage: 'View',
  },
});

const TAXONOMY_FIELDS = {
  sectors: {
    type: 'sector',
    reason: messages.sameSector,
  },
  climate_impacts: {
    type: 'hazard',
    reason: messages.sharedHazard,
  },
  adaptation_support_cycle_step: {
    type: 'adaptation-stage',
    reason: messages.sameCycleStep,
  },
};

const getTaxonomyTitles = (content) =>
  Object.keys(TAXONOMY_FIELDS).reduce((titles, field) => {
    (content[field] || []).forEach((value) => {
      if (value?.token) titles[value.token] = value.title || value.token;
    });
    return titles;
  }, {});

const RelatedTools = ({ content }) => {
  const intl = useIntl();
  const items = content?.['@components']?.relatedtools?.items || [];
  if (!items.length) return null;

  const taxonomyTitles = getTaxonomyTitles(content);

  return (
    <div
      className="extended-tool-related"
      aria-labelledby="related-tools-title"
    >
      <Container>
        <h3 id="related-tools-title">
          {intl.formatMessage(messages.relatedTools)}
        </h3>
        <p className="extended-tool-related-description">
          {intl.formatMessage(messages.description)}
        </p>

        <div className="extended-tool-related-list">
          {items.map((item) => {
            const sharedValues = Object.entries(TAXONOMY_FIELDS).flatMap(
              ([field, config]) =>
                (item.shared?.[field] || []).map((token) => ({
                  field,
                  token,
                  type: config.type,
                })),
            );
            const visibleSharedValues = sharedValues.slice(0, 3);
            const hiddenSharedValues = sharedValues.slice(3);
            const reasons = Object.entries(TAXONOMY_FIELDS)
              .filter(([field]) => item.shared?.[field]?.length)
              .map(([, config]) => intl.formatMessage(config.reason));

            return (
              <article className="extended-tool-related-card" key={item['@id']}>
                <div className="extended-tool-related-card-header">
                  <div>
                    <p className="extended-tool-provider">
                      {item.tool_provider}
                    </p>
                    <h4 className="extended-tool-title">
                      <UniversalLink href={item['@id']}>
                        {item.title}
                      </UniversalLink>
                    </h4>
                  </div>
                  <span
                    className="extended-tool-related-icon"
                    aria-hidden="true"
                  >
                    <Icon className="ri-file-line" />
                  </span>
                </div>
                {sharedValues.length > 0 && (
                  <div className="extended-tool-related-tags">
                    {visibleSharedValues.map(({ field, token, type }) => {
                      const title = taxonomyTitles[token] || token;
                      const label =
                        field === 'adaptation_support_cycle_step'
                          ? title.split(':')[0]
                          : title;

                      return (
                        <span
                          className={`navigator-tag ${type}`}
                          key={`${field}-${token}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                    {hiddenSharedValues.length > 0 && (
                      <span
                        className="navigator-tag more"
                        title={hiddenSharedValues
                          .map(({ token }) => taxonomyTitles[token] || token)
                          .join(', ')}
                      >
                        + {hiddenSharedValues.length}
                      </span>
                    )}
                  </div>
                )}

                <div className="extended-tool-related-card-footer">
                  {/* <span className="extended-tool-related-reason">
                    {reasons.join(' · ')}
                  </span> */}
                  <UniversalLink
                    href={item['@id']}
                    className="extended-tool-related-view"
                  >
                    {intl.formatMessage(messages.view)}
                    <Icon className="ri-arrow-right-line" />
                  </UniversalLink>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default RelatedTools;
