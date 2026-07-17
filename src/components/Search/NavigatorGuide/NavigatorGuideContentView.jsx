import React from 'react';
import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Button, Checkbox, Icon, Loader, Message } from 'semantic-ui-react';
import URLManager from '@elastic/search-ui/lib/cjs/URLManager';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import guideSteps from '../../../search/navigator_guide/guideSteps';
import { navigatorGuideStepAtom } from '../../../state';

import './styles.less';

const messages = defineMessages({
  noSteps: {
    id: 'No Navigator Guide steps are configured.',
    defaultMessage: 'No Navigator Guide steps are configured.',
  },
  guideMe: {
    id: 'Guide me',
    defaultMessage: 'Guide me',
  },
  findTheRightTool: {
    id: 'Find the right tool',
    defaultMessage: 'Find the right tool',
  },
  introduction: {
    id: 'Navigator Guide introduction',
    defaultMessage:
      'Answer a few guided questions. The catalogue on the right narrows as you go - you can skip to the results at any point.',
  },
  stepProgress: {
    id: 'Step {current} of {total}',
    defaultMessage: 'Step {current} of {total}',
  },
  selectAllThatApply: {
    id: 'Select all that apply',
    defaultMessage: 'Select all that apply',
  },
  noOptions: {
    id: 'No options are available for this step.',
    defaultMessage: 'No options are available for this step.',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  skipToResults: {
    id: 'Skip to results',
    defaultMessage: 'Skip to results',
  },
  seeResults: {
    id: 'See results',
    defaultMessage: 'See results',
  },
  nextStep: {
    id: 'Next step',
    defaultMessage: 'Next step',
  },
  livePreview: {
    id: 'Live preview · results based on your selection',
    defaultMessage: 'Live preview · results based on your selection',
  },
  previewEmpty: {
    id: 'Navigator Guide preview empty state',
    defaultMessage:
      'Start by selecting the categories that interest you. The tools filtered by your chosen categories will appear in this box.',
  },
  toolsMatch: {
    id: '{count, plural, one {tool matches} other {tools match}}',
    defaultMessage: '{count, plural, one {tool matches} other {tools match}}',
  },
  seeAllMatchingTools: {
    id: 'See all matching tools',
    defaultMessage: 'See all matching tools',
  },
});

const getFacetOptions = (facets, field) =>
  (facets?.[field]?.[0]?.data || []).map(({ value, count }) => ({
    value,
    count,
  }));

const isStepSelected = (filters, field) =>
  (filters || []).some(
    (filter) => filter.field === field && filter.values?.length,
  );

const NavigatorGuideContentView = ({ appConfig }) => {
  const intl = useIntl();
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
  const [storedActiveStep, setActiveStep] = useAtom(navigatorGuideStepAtom);
  const activeStep =
    Number.isInteger(storedActiveStep) &&
    storedActiveStep >= 0 &&
    storedActiveStep < steps.length
      ? storedActiveStep
      : 0;
  const step = steps[activeStep];
  const selectedValues =
    (filters || []).find((filter) => filter.field === step?.field)?.values ||
    [];
  const options = getFacetOptions(facets, step?.field);
  const isLastStep = activeStep === steps.length - 1;
  const hasSelections = steps.some(({ field }) =>
    isStepSelected(filters, field),
  );

  React.useEffect(() => {
    if (storedActiveStep !== activeStep) {
      setActiveStep(activeStep);
    }
  }, [activeStep, setActiveStep, storedActiveStep]);

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
    return <Message warning>{intl.formatMessage(messages.noSteps)}</Message>;
  }

  return (
    <div className="navigator-guide-search">
      <header className="navigator-guide-header">
        <div className="navigator-guide-eyebrow">
          {intl.formatMessage(messages.guideMe)}
        </div>
        <h2>
          {appConfig.headline || intl.formatMessage(messages.findTheRightTool)}
        </h2>
        <p>
          {appConfig.subheadline || intl.formatMessage(messages.introduction)}
        </p>
      </header>

      <div className="navigator-guide-layout">
        <section className="navigator-guide-wizard">
          <div className="navigator-guide-progress">
            {steps.map((item, index) => (
              <React.Fragment key={item.id}>
                <Button
                  className={`navigator-guide-progress-step${
                    index === activeStep ? ' active' : ''
                  }${index < activeStep ? ' completed' : ''}`}
                  aria-current={index === activeStep ? 'step' : undefined}
                  onClick={() => setActiveStep(index)}
                >
                  <span>
                    {isStepSelected(filters, item.field) ? (
                      <Icon className="ri-check-line" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  {intl.formatMessage(item.label)}
                </Button>
                {index < steps.length - 1 && (
                  <span
                    className={`navigator-guide-progress-connector${
                      index < activeStep ? ' completed' : ''
                    }`}
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div
            className="navigator-guide-progress-bar"
            role="progressbar"
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
              {intl.formatMessage(messages.stepProgress, {
                current: activeStep + 1,
                total: steps.length,
              })}
            </span>
            <span>{intl.formatMessage(messages.selectAllThatApply)}</span>
          </div>
          <h3>{intl.formatMessage(step.title)}</h3>
          {step.description && <p>{intl.formatMessage(step.description)}</p>}

          {isLoading ? (
            <div className="navigator-guide-options-loading">
              <Loader active inline />
            </div>
          ) : options.length > 0 ? (
            <div className="navigator-guide-options">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`navigator-guide-option${
                    selectedValues.includes(option.value) ? ' selected' : ''
                  }`}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onChange={() => toggleValue(option.value)}
                  />
                  <span>{option.value}</span>
                  <small>{option.count}</small>
                </label>
              ))}
            </div>
          ) : (
            <Message>{intl.formatMessage(messages.noOptions)}</Message>
          )}

          <div className="navigator-guide-actions">
            <Button
              className="icon"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((value) => value - 1)}
            >
              <Icon className="ri-arrow-left-line" />
              {intl.formatMessage(messages.back)}
            </Button>
            <div>
              <Button className="primary inverted" onClick={showResults}>
                {intl.formatMessage(messages.skipToResults)}
              </Button>
              <Button
                className="primary icon"
                onClick={() =>
                  isLastStep
                    ? showResults()
                    : setActiveStep((value) => value + 1)
                }
              >
                {intl.formatMessage(
                  isLastStep ? messages.seeResults : messages.nextStep,
                )}
                <Icon className="ri-arrow-right-line" />
              </Button>
            </div>
          </div>
        </section>

        <aside className="navigator-guide-preview">
          <div className="navigator-guide-preview-label">
            {intl.formatMessage(messages.livePreview)}
          </div>
          <div className="navigator-guide-result-count">
            <strong>{isLoading ? '…' : totalResults || 0}</strong>{' '}
            {intl.formatMessage(messages.toolsMatch, {
              count: totalResults || 0,
            })}
          </div>
          {hasSelections ? (
            <>
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
              <Button
                className="primary icon inverted fluid"
                onClick={showResults}
              >
                {intl.formatMessage(messages.seeAllMatchingTools)}
                <Icon className="ri-arrow-right-line" />
              </Button>
            </>
          ) : (
            <p className="navigator-guide-preview-empty">
              {intl.formatMessage(messages.previewEmpty)}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default NavigatorGuideContentView;
