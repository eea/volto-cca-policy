import React from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';
import TagOverflowPopup from '@eeacms/volto-cca-policy/components/theme/TagOverflowPopup';
import ToolThumbnail from '@eeacms/volto-cca-policy/components/theme/ToolThumbnail/ToolThumbnail';
import { getToolThumbnailUrl } from '../../theme/ToolThumbnail/utils';
import {
  getCompareToolTitle,
  getCompareToolUid,
  useCompareTools,
} from '../../theme/CompareTools/utils';
import { rawValueAsArray } from './utils';

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
  typeOfOutput: {
    id: 'Type of outputs',
    defaultMessage: 'Type of outputs',
  },
  compare: {
    id: 'Compare',
    defaultMessage: 'Compare',
  },
  viewTool: {
    id: 'View',
    defaultMessage: 'View',
  },
});

const publicationDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
});

const formatPublicationDate = (value) => {
  if (!value) return '';
  const raw =
    typeof value === 'object' && value !== null && 'raw' in value
      ? value.raw
      : value;
  const val = Array.isArray(raw) ? raw[0] : raw;
  if (!val || typeof val === 'object') return '';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    return publicationDateFormatter.format(d);
  } catch {
    return '';
  }
};

const TagGroup = ({ typeLabel, values, type }) => {
  const visible = values.slice(0, 3);
  const hidden = values.slice(3);
  const remaining = values.length - visible.length;

  return (
    <div className="navigator-catalogue-tags">
      {visible.map((value) => (
        <span key={`${type}-${value}`} className={`navigator-tag ${type}`}>
          {value}
        </span>
      ))}
      {remaining > 0 && (
        <TagOverflowPopup
          items={hidden}
          className={`navigator-tag ${type} more`}
          ariaLabel={`${typeLabel}: ${hidden.join(', ')}`}
        />
      )}
    </div>
  );
};

const CycleElements = ({ intl, values }) => {
  const visible = values.slice(0, 3);
  const hidden = values.slice(3);

  if (!visible.length) return null;

  return (
    <div className="navigator-catalogue-cycle-elements">
      <span className="cycle-elements-label">
        {intl.formatMessage(messages.cycle)}
      </span>
      {visible.map((value, index) => (
        <span
          key={`cycle-element-${index}`}
          className="navigator-tag cycle-element"
        >
          {value}
        </span>
      ))}
      {hidden.length > 0 && (
        <TagOverflowPopup
          items={hidden}
          className="navigator-tag cycle-element more"
          ariaLabel={`${intl.formatMessage(messages.cycle)}: ${hidden.join(', ')}`}
        />
      )}
    </div>
  );
};

const NavigatorCatalogueCardItem = (props) => {
  const { result = {} } = props;
  const intl = useIntl();
  const sectors = rawValueAsArray(result.cca_adaptation_sectors);
  const hazards = rawValueAsArray(result.cca_climate_impacts);
  const keywords = rawValueAsArray(result.cca_keywords);
  const outputs = rawValueAsArray(result.cca_type_of_outputs);

  const outputType = outputs
    .map((value) => value?.title || value)
    .filter(Boolean)
    .join(', ');
  const toolProvider = result?._result?.tool_provider?.raw;
  const adaptationSupportCycleSteps = rawValueAsArray(
    result.cca_adaptation_support_cycle_step,
  )
    .map((value) => {
      const title = value?.title || value;
      return typeof title === 'string' ? title.split(':')[0] : title;
    })
    .filter(Boolean);
  const publicationDate =
    result.publication_date?.raw || result.publication_date;
  const formattedPublicationDate = publicationDate
    ? publicationDateFormatter.format(new Date(publicationDate))
    : '';
  const compareTool = {
    uid: getCompareToolUid(result),
    title: getCompareToolTitle(result),
    href: result.href,
    image: getToolThumbnailUrl(result),
  };
  const { isSelected, isLimitReached, setSelected } =
    useCompareTools(compareTool);

  const onCompareChange = (event, { checked }) => {
    setSelected(checked);
  };

  return (
    <div className={`navigator-catalogue-item${isSelected ? ' selected' : ''}`}>
      <ToolThumbnail result={result} size="large" />

      <div className="catalogue-item-main">
        <div className="catalogue-item-top">
          <div className="navigator-tool-provider" title={toolProvider}>
            {toolProvider}
          </div>
          {formattedPublicationDate && (
            <span className="catalogue-date">{formattedPublicationDate}</span>
          )}
        </div>
        <div className="catalogue-item-heading">
          <h4>
            <ExternalLink href={result.href} title={result.title}>
              {result.title || '[Tool name]'}
            </ExternalLink>
          </h4>
        </div>

        <p className="catalogue-description">
          <ResultContext {...props} />
        </p>

        <div className="catalogue-taxonomy">
          <TagGroup
            typeLabel={intl.formatMessage(messages.sector)}
            values={sectors}
            type="sector"
            maxItems={3}
          />
          <TagGroup
            typeLabel={intl.formatMessage(messages.hazard)}
            values={hazards}
            type="hazard"
            maxItems={3}
          />
        </div>

        <div className="catalogue-keywords">
          <TagGroup values={keywords} type="keyword" />
        </div>

        <div className="catalogue-item-footer">
          <div className="catalogue-meta">
            <CycleElements intl={intl} values={adaptationSupportCycleSteps} />
          </div>
          <div className="catalogue-meta license-type">
            {outputType && (
              <span className="catalogue-output" title={outputType}>
                {intl.formatMessage(messages.typeOfOutput)}: {outputType}
              </span>
            )}
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
            <ExternalLink
              href={result.href}
              className="ui button primary icon"
              labelPosition="left"
            >
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
