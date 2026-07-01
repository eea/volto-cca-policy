import React from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';

const asArray = (value) => {
  if (!value) return [];
  const raw = value.raw !== undefined ? value.raw : value;
  if (!raw) return [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [raw].filter(Boolean);
};

const getStepNumbers = (result) => {
  const values = asArray(result.cca_rast_steps);
  return values
    .map((value) => `${value}`.match(/0?([1-6])/))
    .filter(Boolean)
    .map((match) => Number(match[1]));
};

const ChipGroup = ({ values, type }) => {
  const visible = values.slice(0, 3);
  const remaining = values.length - visible.length;

  return (
    <div className="navigator-catalogue-chips">
      {visible.map((value) => (
        <span key={`${type}-${value}`} className={`catalogue-chip ${type}`}>
          {value}
        </span>
      ))}
      {remaining > 0 && (
        <span className={`catalogue-chip ${type} more`}>+ {remaining}</span>
      )}
    </div>
  );
};

const CycleSteps = ({ selected }) => (
  <div className="navigator-catalogue-cycle">
    <span className="cycle-label">Cycle</span>
    {[1, 2, 3, 4, 5, 6].map((step) => (
      <span
        key={step}
        className={`cycle-step ${selected.includes(step) ? 'active' : ''}`}
      >
        {`${step}`.padStart(2, '0')}
      </span>
    ))}
  </div>
);

const NavigatorCatalogueCardItem = (props) => {
  const { result } = props;
  const sectors = asArray(result.cca_adaptation_sectors);
  const hazards = asArray(result.cca_climate_impacts);
  const selectedSteps = getStepNumbers(result);

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
          <ChipGroup values={sectors} type="sector" />
          <ChipGroup values={hazards} type="hazard" />
        </div>

        <div className="catalogue-item-footer">
          <div className="catalogue-meta">
            <CycleSteps selected={selectedSteps} />
            <span className="catalogue-licence">Licence - {'[Licence]'}</span>
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
