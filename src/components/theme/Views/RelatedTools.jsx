import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { Container, Icon, Popup } from 'semantic-ui-react';
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
  view: {
    id: 'View',
    defaultMessage: 'View',
  },
});

const TAXONOMY_FIELDS = {
  sectors: {
    type: 'sector',
  },
  climate_impacts: {
    type: 'hazard',
  },
  adaptation_support_cycle_step: {
    type: 'adaptation-stage',
  },
};

const getSharedGroups = (item) =>
  Object.entries(TAXONOMY_FIELDS)
    .map(([field, config]) => ({
      field,
      type: config.type,
      values: item.shared?.[field] || [],
    }))
    .filter(({ values }) => values.length);

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
            const sharedGroups = getSharedGroups(item);

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
                {sharedGroups.length > 0 && (
                  <div className="extended-tool-related-tags">
                    {sharedGroups.map(({ field, type, values }) => {
                      const [visible, ...hidden] = values;
                      const visibleTitle = taxonomyTitles[visible] || visible;
                      const visibleLabel =
                        field === 'adaptation_support_cycle_step'
                          ? visibleTitle.split(':')[0]
                          : visibleTitle;
                      const hiddenTitles = hidden.map(
                        (token) => taxonomyTitles[token] || token,
                      );

                      return (
                        <span
                          className="extended-tool-related-tag-group"
                          key={field}
                        >
                          <span className={`navigator-tag ${type}`}>
                            {visibleLabel}
                          </span>
                          {hidden.length > 0 && (
                            <Popup
                              className="catalogue-tag-popup"
                              content={
                                <div className="catalogue-tag-tooltip">
                                  <ul>
                                    {hiddenTitles.map((title, index) => (
                                      <li key={`${field}-${hidden[index]}`}>
                                        {title}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              }
                              position="bottom left"
                              trigger={
                                <button
                                  type="button"
                                  className={`navigator-tag ${type} more`}
                                  aria-label={hiddenTitles.join(', ')}
                                >
                                  + {hidden.length}
                                </button>
                              }
                            />
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="extended-tool-related-card-footer">
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
