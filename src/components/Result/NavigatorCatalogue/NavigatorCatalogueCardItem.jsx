import React from 'react';
import { Checkbox, Icon, Popup } from 'semantic-ui-react';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';

const asArray = (value) => {
  if (!value) return [];
  const raw = value.raw !== undefined ? value.raw : value;
  if (!raw) return [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [raw].filter(Boolean);
};

const TagGroup = ({ values, type }) => {
  const visible = values.slice(0, 3);
  const hidden = values.slice(3);
  const remaining = values.length - visible.length;
  const hiddenLabel = hidden.join(', ');

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
            <span
              className={`catalogue-tag ${type} more`}
              aria-label={`Additional ${type} values: ${hiddenLabel}`}
            >
              + {remaining}
            </span>
          }
        />
      )}
    </div>
  );
};

const CycleElements = ({ values }) => {
  const visible = values.slice(0, 3);

  return (
    <div className="navigator-catalogue-cycle-elements">
      <span className="cycle-elements-label">Cycle</span>
      {visible.map((value, index) => (
        <span key={`cycle-element-${index}`} className="cycle-element">
          {value}
        </span>
      ))}
    </div>
  );
};

const cycleElementPlaceholders = ['[Cycle]'];

const NavigatorCatalogueCardItem = (props) => {
  const { result } = props;
  const sectors = asArray(result.cca_adaptation_sectors);
  const hazards = asArray(result.cca_climate_impacts);

  return (
    <div className="navigator-catalogue-item">
      <div className="catalogue-item-icon" aria-hidden="true">
        <Icon name="file outline" />
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
          <TagGroup values={sectors} type="sector" />
          <TagGroup values={hazards} type="hazard" />
        </div>

        <div className="catalogue-item-footer">
          <div className="catalogue-meta">
            <CycleElements values={cycleElementPlaceholders} />
            <span className="catalogue-licence">License - {'[Licence]'}</span>
          </div>

          <div className="catalogue-actions">
            <label className="catalogue-compare">
              <Checkbox />
              <span>Compare</span>
            </label>
            <ExternalLink className="ui button primary icon" href={result.href}>
              View tool <Icon name="arrow right" />
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigatorCatalogueCardItem;
