import React from 'react';
import { useAtom } from 'jotai';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Container,
  Icon,
  Loader,
  Message,
  Table,
  Button,
} from 'semantic-ui-react';
import Helmet from '@plone/volto/helpers/Helmet/Helmet';
import BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
import config from '@plone/volto/registry';
import { applyConfigurationSchema, rebind } from '@eeacms/search';
import { fetchResult } from '@eeacms/search/lib/hocs/useResult';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import { compareToolsAtom } from './CompareToolsPanel';

const appName = 'navigatorCatalogueSearch';

const asArray = (value) => {
  if (!value) return [];
  const raw = value.raw !== undefined ? value.raw : value;
  if (!raw) return [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [raw].filter(Boolean);
};

const getToolField = (tool, field) =>
  tool.result?.[field] || tool.result?._result?.[field];

const getCompareIds = (search) => {
  const params = new URLSearchParams(search);
  return [...new Set(params.getAll('id').filter(Boolean))];
};

const getToolTitle = (result, fallback) => {
  if (!result?._result?._meta?.found) {
    return fallback;
  }

  return result.title || result._result?.title?.raw || fallback;
};

const getToolHref = (result) =>
  result?.href || result?.['@id'] || result?._result?.href?.raw || '';

const getTools = async (ids, appConfig, registry) => {
  const tools = await Promise.all(
    ids.map(async (id) => {
      try {
        const result = await fetchResult(id, appConfig, registry);
        return {
          id,
          title: getToolTitle(result, id),
          href: getToolHref(result),
          result,
          error: !result?._result?._meta?.found,
        };
      } catch (error) {
        return {
          id,
          title: id,
          error: true,
        };
      }
    }),
  );

  return tools;
};

const NavigatorCatalogueCompareView = () => {
  const history = useHistory();
  const location = useLocation();
  const [, setSelectedTools] = useAtom(compareToolsAtom);
  const ids = React.useMemo(
    () => getCompareIds(location.search),
    [location.search],
  );
  const registry = config.settings.searchlib;
  const appConfig = React.useMemo(
    () => applyConfigurationSchema(rebind(registry.searchui[appName])),
    [registry.searchui],
  );
  const [tools, setTools] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;

    const loadTools = async () => {
      setIsLoading(true);
      const results = await getTools(ids, appConfig, registry);

      if (!ignore) {
        setTools(results);
        setIsLoading(false);
      }
    };

    if (ids.length) {
      loadTools();
    } else {
      setTools([]);
      setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [ids, appConfig, registry]);

  const failedTools = tools.filter((tool) => tool.error);
  const visibleTools = tools.filter((tool) => !tool.error);
  const visibleToolsCount = visibleTools.length;

  const removeTool = (toolId) => {
    const params = new URLSearchParams(location.search);
    const remainingIds = ids.filter((id) => id !== toolId);

    params.delete('id');
    remainingIds.forEach((id) => params.append('id', id));

    setSelectedTools((selectedTools) =>
      selectedTools.filter(
        (tool) => tool.id !== toolId && tool.esId !== toolId,
      ),
    );

    history.push({
      pathname: location.pathname,
      search: params.toString() ? `?${params.toString()}` : '',
      hash: location.hash,
    });
  };

  return (
    <div className="navigator-catalogue-compare-view">
      <Helmet title="Compare tools" />
      <BodyClass className="navigator-catalogue-compare-page" />

      <Container>
        <h1>
          Comparing {visibleToolsCount}{' '}
          {visibleToolsCount === 1 ? 'tool' : 'tools'}
        </h1>

        {ids.length === 0 && (
          <Message>
            No tools were selected for comparison. Select at least two tools
            from the Navigator Catalogue.
          </Message>
        )}

        {isLoading && <Loader active inline="centered" />}

        {!isLoading && failedTools.length > 0 && (
          <Message warning>
            Some selected tools could not be loaded and were skipped.
          </Message>
        )}

        {!isLoading && visibleTools.length > 0 && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>CRITERIA</Table.HeaderCell>
                {visibleTools.map((tool) => (
                  <Table.HeaderCell key={tool.id}>
                    <div className="compare-tool-header">
                      <div className="catalogue-provider">{'[Provider]'}</div>
                      <div className="compare-tool-title" title={tool.title}>
                        {tool.title}
                      </div>
                      <div className="compare-tool-actions">
                        {tool.href && (
                          <ExternalLink
                            className="ui button secondary icon compare-tool-open"
                            href={tool.href}
                          >
                            Open tool
                            <Icon className="ri-external-link-line" />
                          </ExternalLink>
                        )}
                        <Button
                          className="icon compare-tool-clear"
                          aria-label={`Remove ${tool.title} from comparison`}
                          onClick={() => removeTool(tool.id)}
                        >
                          <Icon className="ri-close-line" />
                        </Button>
                      </div>
                    </div>
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">Usability</div>
                    <div className="compare-criteria-helper">
                      2 lines about what usability means
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`usability-${tool.id}`}>
                    <div className="usability-value">Moderate</div>
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">Functionality</div>
                    <div className="compare-criteria-helper">
                      2 lines about what functionality means
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`functionality-${tool.id}`}>
                    <div
                      className="compare-functionality-dots"
                      aria-label="3 out of 6"
                    >
                      {[0, 1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={`compare-functionality-dot${
                            dot < 3 ? ' filled' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span>functionality score detail</span>
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">Spatial scale</div>
                    <div className="compare-criteria-helper">
                      2 lines about what spatial scale means
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`spatial-scale-${tool.id}`}>
                    Spatial scale data
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">Output type</div>
                    <div className="compare-criteria-helper">
                      2 lines about what output type means
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`output-type-${tool.id}`}>
                    Output type data
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">
                      Adaptation support cycle step
                    </div>
                    <div className="compare-criteria-helper">
                      2 lines about what adaptation support cycle step means
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`adaptation-support-cycle-step-${tool.id}`}>
                    Adaptation support cycle step data
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">Sector</div>
                    <div className="compare-criteria-helper">
                      2 lines about what sector means
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`sector-${tool.id}`}>
                    {asArray(getToolField(tool, 'cca_adaptation_sectors')).join(
                      ', ',
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          </Table>
        )}
      </Container>
    </div>
  );
};

export default NavigatorCatalogueCompareView;
