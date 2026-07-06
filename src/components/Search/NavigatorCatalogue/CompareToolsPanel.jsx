import React from 'react';
import { atom, useAtom } from 'jotai';
import { Icon, Button } from 'semantic-ui-react';

export const compareToolsAtom = atom([]);

export const getCompareToolId = (result) =>
  result.href || result.id || result['@id'] || result.title || '';

export const getCompareToolTitle = (result) => result.title || '[Tool name]';

export const CompareToolsPanel = () => {
  const [selectedTools, setSelectedTools] = useAtom(compareToolsAtom);
  const isReadyToCompare = selectedTools.length >= 2;

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
              <button
                type="button"
                className="compare-panel-tool-clear"
                aria-label={`Remove ${tool.title}`}
                onClick={() => removeTool(tool.id)}
              >
                <Icon className="ri-close-line" />
              </button>
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
            primary
            icon
            fluid
            labelPosition="left"
            className="compare-panel-submit"
            disabled={!isReadyToCompare}
          >
            <Icon className="ri-layout-column-line" />
            Compare selected tools
          </Button>
          <Button
            type="button"
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
