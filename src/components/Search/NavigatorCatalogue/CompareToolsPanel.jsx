import React from 'react';
import { atom, useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';

export const compareToolsAtom = atom([]);

const messages = defineMessages({
  compareTools: {
    id: 'Compare tools',
    defaultMessage: 'Compare tools',
  },
  removeTool: {
    id: 'Remove {title}',
    defaultMessage: 'Remove {title}',
  },
  readyToCompare: {
    id: 'Ready to compare',
    defaultMessage: 'Ready to compare',
  },
  compareSelectedTools: {
    id: 'Compare selected tools',
    defaultMessage: 'Compare selected tools',
  },
  clearAll: {
    id: 'Clear all',
    defaultMessage: 'Clear all',
  },
});

export const getCompareToolEsId = (result) =>
  result._original?._id ||
  result._result?._meta?._id ||
  result._result?.id ||
  '';

export const getCompareToolId = (result) => {
  return (
    getCompareToolEsId(result) ||
    result.href ||
    result.id ||
    result['@id'] ||
    result.title ||
    ''
  );
};

export const getCompareToolTitle = (result) => result.title || '';

const getCompareUrl = (tools) => {
  const params = new URLSearchParams();

  tools.forEach((tool) => {
    if (tool.esId) {
      params.append('id', tool.esId);
    }
  });

  const query = params.toString();
  return query
    ? `/navigator-catalogue/compare?${query}`
    : '/navigator-catalogue/compare';
};

export const CompareToolsPanel = () => {
  const intl = useIntl();
  const [selectedTools, setSelectedTools] = useAtom(compareToolsAtom);
  const selectedToolsWithEsId = selectedTools.filter((tool) => tool.esId);
  const isReadyToCompare = selectedToolsWithEsId.length >= 2;
  const compareUrl = getCompareUrl(selectedTools);

  if (selectedTools.length === 0) return null;

  const removeTool = (toolId) => {
    setSelectedTools((tools) => tools.filter((tool) => tool.id !== toolId));
  };

  return (
    <div className="catalogue-compare-panel" aria-live="polite">
      <div className="compare-panel-header">
        <h2>
          {intl.formatMessage(messages.compareTools)}
          {/* <span className="compare-panel-count">
            &lt;{selectedTools.length}&gt;
          </span> */}
        </h2>
      </div>

      <div className="compare-panel-content">
        <div className="compare-panel-tools">
          {selectedTools.map((tool) => (
            <div key={tool.id} className="compare-panel-tool">
              <span className="compare-panel-tool-title">{tool.title}</span>
              <Button
                className="compare-panel-tool-clear"
                aria-label={intl.formatMessage(messages.removeTool, {
                  title: tool.title,
                })}
                onClick={() => removeTool(tool.id)}
              >
                <Icon className="ri-close-line" />
              </Button>
            </div>
          ))}
        </div>

        <div className="compare-panel-actions">
          {isReadyToCompare && (
            <div className="compare-panel-status ready">
              <Icon className="ri-check-line" />{' '}
              {intl.formatMessage(messages.readyToCompare)}
            </div>
          )}
          <Button
            as={isReadyToCompare ? Link : undefined}
            to={isReadyToCompare ? compareUrl : undefined}
            primary
            icon
            className="compare-panel-submit"
            disabled={!isReadyToCompare}
          >
            <Icon className="ri-layout-column-line" />
            <span>{intl.formatMessage(messages.compareSelectedTools)}</span>
          </Button>
          <Button
            className="compare-panel-clear-all"
            onClick={() => setSelectedTools([])}
          >
            {intl.formatMessage(messages.clearAll)}
          </Button>
        </div>
      </div>
    </div>
  );
};
