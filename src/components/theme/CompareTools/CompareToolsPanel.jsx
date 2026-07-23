import React from 'react';
import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import {
  MAX_COMPARE_TOOLS,
  compareToolsAtom,
  getCompareLocation,
} from './utils';

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
  addTool: {
    id: 'Add a tool',
    defaultMessage: 'Add a tool',
  },
  clearAll: {
    id: 'Clear all',
    defaultMessage: 'Clear all',
  },
});

export const CompareToolsPanel = ({ appConfig: suppliedAppConfig }) => {
  const intl = useIntl();
  const history = useHistory();
  const currentLang = useSelector((state) => state.intl.locale);
  const appConfig = suppliedAppConfig || { landingPageURL: '/en/navigator' };
  const [selectedTools, setSelectedTools] = useAtom(compareToolsAtom);
  const resolvableSelectedTools = selectedTools.filter((tool) => tool.uid);
  const isReadyToCompare = resolvableSelectedTools.length >= 2;
  const emptySlots = MAX_COMPARE_TOOLS - selectedTools.length;

  if (selectedTools.length === 0) return null;

  const removeTool = (toolUid) => {
    setSelectedTools((tools) => tools.filter((tool) => tool.uid !== toolUid));
  };

  const compareTools = () => {
    const returnURL = [
      window.location.pathname,
      window.location.search,
      window.location.hash,
    ].join('');

    history.push(
      getCompareLocation(selectedTools, appConfig, currentLang, returnURL),
    );
  };

  return (
    <div className="catalogue-compare-panel" aria-live="polite">
      <div className="compare-panel-header">
        <h2>
          {intl.formatMessage(messages.compareTools)}
          <span className="compare-panel-count">
            {selectedTools.length}/{MAX_COMPARE_TOOLS}
          </span>
        </h2>
      </div>

      <div className="compare-panel-content">
        <div className="compare-panel-tools">
          {selectedTools.map((tool) => (
            <div key={tool.uid} className="compare-panel-tool">
              <span className="compare-panel-tool-title">{tool.title}</span>
              <Button
                className="compare-panel-tool-clear"
                aria-label={intl.formatMessage(messages.removeTool, {
                  title: tool.title,
                })}
                onClick={() => removeTool(tool.uid)}
              >
                <Icon className="ri-close-line" />
              </Button>
            </div>
          ))}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`compare-placeholder-${index}`}
              className="compare-panel-tool placeholder"
            >
              <Icon className="ri-add-line" />
              <span>{intl.formatMessage(messages.addTool)}</span>
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
            primary
            className="compare-panel-submit"
            disabled={!isReadyToCompare}
            onClick={compareTools}
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
