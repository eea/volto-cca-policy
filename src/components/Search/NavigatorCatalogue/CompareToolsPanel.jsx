import React from 'react';
import { atom, useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

export const compareToolsAtom = atom([]);

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

export const getCompareToolTitle = (result) => result.title || '[Tool name]';

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
          Compare tools
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
                aria-label={`Remove ${tool.title}`}
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
              <Icon className="ri-check-line" /> Ready to compare
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
            <span>Compare selected tools</span>
          </Button>
          <Button
            className="compare-panel-clear-all"
            onClick={() => setSelectedTools([])}
          >
            Clear all
          </Button>
        </div>
      </div>
    </div>
  );
};
