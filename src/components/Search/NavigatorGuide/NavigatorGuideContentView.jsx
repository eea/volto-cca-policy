import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Checkbox, Icon, Loader, Message } from 'semantic-ui-react';
import URLManager from '@elastic/search-ui/lib/cjs/URLManager';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import guideSteps from '../../../search/navigator_guide/guideSteps';

import './styles.less';

const getFacetOptions = (facets, field) =>
  (facets?.[field]?.[0]?.data || []).map(({ value, count }) => ({
    value,
    count,
  }));

const NavigatorGuideContentView = ({ appConfig }) => {
  const history = useHistory();
  const currentLang = useSelector((state) => state.intl.locale || 'en');
  const searchContext = useSearchContext();
  const {
    addFilter,
    facets,
    filters,
    isLoading,
    removeFilter,
    results,
    totalResults,
  } = searchContext;
  const steps = guideSteps;
  const [activeStep, setActiveStep] = React.useState(0);
  const step = steps[activeStep];
  const selectedValues =
    (filters || []).find((filter) => filter.field === step?.field)?.values ||
    [];
  const options = getFacetOptions(facets, step?.field);
  const isLastStep = activeStep === steps.length - 1;

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      removeFilter(step.field, value, step.filterType);
    } else {
      addFilter(step.field, value, step.filterType);
    }
  };

  const showResults = () => {
    const allowedFields = new Set([
      'language',
      ...steps.map(({ field }) => field),
    ]);
    const resultFilters = (filters || []).filter(({ field }) =>
      allowedFields.has(field),
    );
    const query = new URLManager().stateToUrl({ filters: resultFilters });
    const pathname = (appConfig.resultsPageURL || '/en/navigator').replace(
      /^\/en(?=\/|$)/,
      `/${currentLang}`,
    );

    history.push({ pathname, search: query ? `?${query}` : '' });
  };

  if (!step) {
    return <Message warning>No Navigator Guide steps are configured.</Message>;
  }

  return (
    <div className="navigator-guide-search">
      <header className="navigator-guide-header">
        <div className="navigator-guide-eyebrow">Guide me</div>
        <h2>Find the right tool</h2>
        <p>
          Answer a few guided questions. The catalogue on the right narrows as
          you go - you can skip to the results at any point.
        </p>
      </header>

      <div className="navigator-guide-layout">
        <section className="navigator-guide-wizard">
          <div className="navigator-guide-progress">
            {steps.map((item, index) => (
              <div
                key={item.id}
                className={`navigator-guide-progress-step${
                  index === activeStep ? ' active' : ''
                }${index < activeStep ? ' completed' : ''}`}
              >
                <span>
                  {index < activeStep ? (
                    <Icon className="ri-check-line" />
                  ) : (
                    index + 1
                  )}
                </span>
                {item.label}
              </div>
            ))}
          </div>
          <div
            className="navigator-guide-progress-bar"
            role="progressbar"
            aria-label="Navigator guide progress"
            aria-valuemin="1"
            aria-valuemax={steps.length}
            aria-valuenow={activeStep + 1}
          >
            <div
              className="navigator-guide-progress-bar-fill"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="navigator-guide-step-meta">
            <span className="navigator-guide-step-number">
              Step {activeStep + 1} of {steps.length}
            </span>
            <span>Select all that apply</span>
          </div>
          <h3>{step.title}</h3>
          {step.description && <p>{step.description}</p>}

          {isLoading ? (
            <div className="navigator-guide-options-loading">
              <Loader active inline />
            </div>
          ) : (
            <div className="navigator-guide-options">
              {options.length > 0 ? (
                options.map((option) => (
                  <label key={option.value} className="navigator-guide-option">
                    <Checkbox
                      checked={selectedValues.includes(option.value)}
                      onChange={() => toggleValue(option.value)}
                    />
                    <span>{option.value}</span>
                    <small>{option.count}</small>
                  </label>
                ))
              ) : (
                <Message>No options are available for this step.</Message>
              )}
            </div>
          )}

          <div className="navigator-guide-actions">
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((value) => value - 1)}
            >
              <Icon className="ri-arrow-left-line" /> Back
            </Button>
            <div>
              <Button onClick={showResults}>Skip to results</Button>
              <Button
                className="primary icon"
                onClick={() =>
                  isLastStep
                    ? showResults()
                    : setActiveStep((value) => value + 1)
                }
              >
                {isLastStep ? 'See results' : 'Next step'}
                <Icon className="ri-arrow-right-line" />
              </Button>
            </div>
          </div>
        </section>

        <aside className="navigator-guide-preview">
          <div className="navigator-guide-preview-label">
            Live preview · results based on your selection
          </div>
          <div className="navigator-guide-result-count">
            <strong>{isLoading ? '…' : totalResults || 0}</strong> tools match
          </div>
          <div className="navigator-guide-preview-results">
            {(results || [])
              .slice(0, appConfig.previewResultsLimit)
              .map((result) => (
                <div key={result._original?._id || result.href}>
                  <small className="navigator-guide-preview-provider">
                    [Provider]
                  </small>
                  <a
                    href={result.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="navigator-guide-preview-result"
                  >
                    <h5>{result.title}</h5>
                  </a>
                </div>
              ))}
          </div>
          <Button className="primary icon inverted fluid" onClick={showResults}>
            See all matching tools <Icon className="ri-arrow-right-line" />
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default NavigatorGuideContentView;
