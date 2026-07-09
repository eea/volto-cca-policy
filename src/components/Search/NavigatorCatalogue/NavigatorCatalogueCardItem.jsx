import React from 'react';
import { useAtom } from 'jotai';
import { Checkbox, Icon, Popup } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';
import {
  MAX_COMPARE_TOOLS,
  compareToolsAtom,
  getCompareToolEsId,
  getCompareToolId,
  getCompareToolTitle,
} from './CompareToolsPanel';

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

  return (
    <div className="navigator-catalogue-cycle-elements">
      <span className="cycle-elements-label">
        {intl.formatMessage(messages.cycle)}
      </span>
      {visible.map((value, index) => (
        <span key={`cycle-element-${index}`} className="cycle-element">
          {value}
        </span>
      ))}
    </div>
  );
};

const NavigatorCatalogueCardItem = (props) => {
  const { result } = props;
  const intl = useIntl();
  const [selectedTools, setSelectedTools] = useAtom(compareToolsAtom);
  const sectors = asArray(result.cca_adaptation_sectors);
  const hazards = asArray(result.cca_climate_impacts);
  const sectorLabel = intl.formatMessage(messages.sector);
  const hazardLabel = intl.formatMessage(messages.hazard);
  const compareTool = {
    id: getCompareToolId(result),
    esId: getCompareToolEsId(result),
    title: getCompareToolTitle(result),
    href: result.href,
  };
  const cycleElementPlaceholders = ['[Cycle]'];
  const isSelectedForCompare = selectedTools.some(
    (tool) => tool.id === compareTool.id,
  );
  const isCompareLimitReached =
    selectedTools.length >= MAX_COMPARE_TOOLS && !isSelectedForCompare;

  const onCompareChange = (event, { checked }) => {
    setSelectedTools((tools) => {
      if (!checked) {
        return tools.filter((tool) => tool.id !== compareTool.id);
      }

      if (tools.some((tool) => tool.id === compareTool.id)) {
        return tools;
      }

      if (tools.length >= MAX_COMPARE_TOOLS) {
        return tools;
      }

      return [...tools, compareTool];
    });
  };

  return (
    <div className="navigator-catalogue-item">
      <div className="catalogue-item-icon" aria-hidden="true">
        <Icon name="ri-file-line" />
      </div>

      <div className="catalogue-item-main">
        <div className="catalogue-item-top">
          <div className="catalogue-provider">{'[Provider]'}</div>
          <span className="catalogue-id">[ID]</span>
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
            <CycleElements intl={intl} values={cycleElementPlaceholders} />
            <span className="catalogue-licence">
              {intl.formatMessage(messages.license)} - [Licence]
            </span>
          </div>

          <div className="catalogue-actions">
            <label className="catalogue-compare">
              <Checkbox
                checked={isSelectedForCompare}
                disabled={isCompareLimitReached}
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
