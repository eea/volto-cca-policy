import React from 'react';
import { Checkbox, Icon, Popup } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';
import {
  getCompareToolTitle,
  getCompareToolUid,
  useCompareTools,
} from '../../theme/CompareTools/utils';

const messages = defineMessages({
  sector: {
    id: 'Sector',
    defaultMessage: 'Sector',
  },
  hazard: {
    id: 'Hazard',
    defaultMessage: 'Hazard',
  },
  cycle: {
    id: 'Cycle',
    defaultMessage: 'Cycle',
  },
  license: {
    id: 'License',
    defaultMessage: 'License',
  },
  type: {
    id: 'Type',
    defaultMessage: 'Type',
  },
  compare: {
    id: 'Compare',
    defaultMessage: 'Compare',
  },
  viewTool: {
    id: 'View tool',
    defaultMessage: 'View tool',
  },
});

const asArray = (value) => {
  if (!value) return [];
  const raw = value.raw !== undefined ? value.raw : value;
  if (!raw) return [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [raw].filter(Boolean);
};

const publicationDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
});

const TagGroup = ({ intl, typeLabel, values, type }) => {
  const visible = values.slice(0, 3);
  const hidden = values.slice(3);
  const remaining = values.length - visible.length;

  return (
    <div className="navigator-catalogue-tags">
      {visible.map((value) => (
        <span key={`${type}-${value}`} className={`catalogue-tag ${type}`}>
          {value}
        </span>
      ))}
      {remaining > 0 && (
        <Popup
          className="catalogue-tag-popup"
          content={
            <div className="catalogue-tag-tooltip">
              <ul>
                {hidden.map((value) => (
                  <li key={`${type}-hidden-${value}`}>{value}</li>
                ))}
              </ul>
            </div>
          }
          position="bottom left"
          trigger={
            <span className={`catalogue-tag ${type} more`}>+ {remaining}</span>
          }
        />
      )}
    </div>
  );
};

const CycleElements = ({ intl, values }) => {
  const visible = values.slice(0, 3);

  if (!visible.length) return null;

  return (
    <div className="navigator-catalogue-cycle-elements">
      <span className="cycle-elements-label">
        {intl.formatMessage(messages.cycle)}
      </span>
      {visible.map((value, index) => (
        <span
          key={`cycle-element-${index}`}
          className="catalogue-tag cycle-element"
        >
          {value}
        </span>
      ))}
    </div>
  );
};

const NavigatorCatalogueCardItem = (props) => {
  const { result } = props;
  const intl = useIntl();
  const sectors = asArray(result.cca_adaptation_sectors);
  const hazards = asArray(result.cca_climate_impacts);
  const licenseStatus = asArray(result.license_status)
    .map((value) => value?.title)
    .filter(Boolean)
    .join(', ');
  const adaptationSupportCycleSteps = asArray(
    result.adaptation_support_cycle_step,
  )
    .map((value) => value?.title?.split(':')[0])
    .filter(Boolean);
  const publicationDate =
    result.publication_date?.raw || result.publication_date;
  const formattedPublicationDate = publicationDate
    ? publicationDateFormatter.format(new Date(publicationDate))
    : '';
  const sectorLabel = intl.formatMessage(messages.sector);
  const hazardLabel = intl.formatMessage(messages.hazard);
  const compareTool = {
    uid: getCompareToolUid(result),
    title: getCompareToolTitle(result),
    href: result.href,
  };
  const { isSelected, isLimitReached, setSelected } =
    useCompareTools(compareTool);

  const onCompareChange = (event, { checked }) => {
    setSelected(checked);
  };

  return (
    <div className={`navigator-catalogue-item${isSelected ? ' selected' : ''}`}>
      <div className="catalogue-item-icon" aria-hidden="true">
        <Icon name="ri-file-line" />
      </div>

      <div className="catalogue-item-main">
        <div className="catalogue-item-top">
          <div className="catalogue-provider">{'[Provider]'}</div>
          {formattedPublicationDate && (
            <span className="catalogue-date">{formattedPublicationDate}</span>
          )}
        </div>
        <div className="catalogue-item-heading">
          <h3>
            <ExternalLink href={result.href} title={result.title}>
              {result.title || '[Tool name]'}
            </ExternalLink>
          </h3>
        </div>

        <p className="catalogue-description">
          <ResultContext {...props} />
        </p>

        <div className="catalogue-taxonomy">
          <TagGroup
            intl={intl}
            typeLabel={sectorLabel}
            values={sectors}
            type="sector"
          />
          <TagGroup
            intl={intl}
            typeLabel={hazardLabel}
            values={hazards}
            type="hazard"
          />
        </div>

        <div className="catalogue-item-footer">
          <div className="catalogue-meta">
            <CycleElements intl={intl} values={adaptationSupportCycleSteps} />
          </div>

          <div className="catalogue-meta license-type">
            {licenseStatus && (
              <span className="catalogue-licence" title={licenseStatus}>
                {intl.formatMessage(messages.license)}: {licenseStatus}
              </span>
            )}
            {''}·{''}
            <span className="catalogue-type">
              {intl.formatMessage(messages.type)}: Tool
            </span>
          </div>

          <div className="catalogue-actions">
            <label className="catalogue-compare">
              <Checkbox
                checked={isSelected}
                disabled={isLimitReached || !compareTool.uid}
                onChange={onCompareChange}
              />
              <span>{intl.formatMessage(messages.compare)}</span>
            </label>
            <ExternalLink className="ui button primary icon" href={result.href}>
              {intl.formatMessage(messages.viewTool)}
              <Icon className="ri-arrow-right-line" />
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigatorCatalogueCardItem;
