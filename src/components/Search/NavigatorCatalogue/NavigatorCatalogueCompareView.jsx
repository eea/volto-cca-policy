import React from 'react';
import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
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
import Api from '@plone/volto/helpers/Api/Api';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import { defineMessages, useIntl } from 'react-intl';
import { MAX_COMPARE_TOOLS, compareToolsAtom } from './CompareToolsPanel';
import {
  asArray,
  exportComparisonTable,
  getLocalizedLandingPageURL,
} from './utils';

const messages = defineMessages({
  compareTools: {
    id: 'Compare tools',
    defaultMessage: 'Compare tools',
  },
  comparingTools: {
    id: 'Comparing {count} {count, plural, one {tool} other {tools}}',
    defaultMessage:
      'Comparing {count} {count, plural, one {tool} other {tools}}',
  },
  notEnoughTools: {
    id: 'At least two valid tools are required for comparison. Select tools from the Navigator Catalogue.',
    defaultMessage:
      'At least two valid tools are required for comparison. Select tools from the Navigator Catalogue.',
  },
  toolsSkipped: {
    id: 'Some selected tools could not be loaded and were skipped.',
    defaultMessage: 'Some selected tools could not be loaded and were skipped.',
  },
  allToolsFailed: {
    id: 'The selected tools could not be loaded. Return to the Navigator Catalogue and select them again.',
    defaultMessage:
      'The selected tools could not be loaded. Return to the Navigator Catalogue and select them again.',
  },
  criteria: {
    id: 'Criteria',
    defaultMessage: 'Criteria',
  },
  openTool: {
    id: 'Open tool',
    defaultMessage: 'Open tool',
  },
  backToResults: {
    id: 'Back to results',
    defaultMessage: 'Back to results',
  },
  exportTable: {
    id: 'Export table',
    defaultMessage: 'Export table',
  },
  usability: {
    id: 'Usability',
    defaultMessage: 'Usability',
  },
  functionality: {
    id: 'Functionality',
    defaultMessage: 'Functionality',
  },
  spatialScale: {
    id: 'Spatial scale',
    defaultMessage: 'Spatial scale',
  },
  outputType: {
    id: 'Output type',
    defaultMessage: 'Output type',
  },
  adaptationSupportCycleStep: {
    id: 'Adaptation support cycle step',
    defaultMessage: 'Adaptation support cycle step',
  },
  sector: {
    id: 'Sector',
    defaultMessage: 'Sector',
  },
});

const getToolField = (tool, field) => {
  const fieldAliases = {
    cca_adaptation_sectors: 'sectors',
  };

  return (
    tool.result?.[field] ||
    tool.result?.[fieldAliases[field]] ||
    tool.result?._result?.[field]
  );
};

const getCompareUids = (search) => {
  const params = new URLSearchParams(search);

  return [...new Set(params.getAll('uid').filter(Boolean))].slice(
    0,
    MAX_COMPARE_TOOLS,
  );
};

const getReturnURL = (search) => {
  const returnURL = new URLSearchParams(search).get('return_url');

  return returnURL?.startsWith('/') && !returnURL.startsWith('//')
    ? returnURL
    : '';
};

const getToolTitle = (result, fallback) => result?.title || fallback;

const getToolHref = (result) => result?.['@id'] || '';

const fetchContentByUid = async (uid, currentLang) => {
  const api = new Api();
  const searchResult = await api.get(`/${currentLang}/@search`, {
    params: { UID: uid, b_size: 1 },
  });
  const itemUrl = searchResult?.items?.[0]?.['@id'];

  return itemUrl ? api.get(flattenToAppURL(itemUrl)) : null;
};

const getTools = async (uids, currentLang) => {
  const tools = await Promise.all(
    uids.map(async (uid) => {
      try {
        const result = await fetchContentByUid(uid, currentLang);
        return {
          id: uid,
          title: getToolTitle(result, uid),
          href: getToolHref(result),
          result,
          error: !result,
        };
      } catch (error) {
        return {
          id: uid,
          title: uid,
          error: true,
        };
      }
    }),
  );

  return tools;
};

const NavigatorCatalogueCompareView = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const currentLang = useSelector((state) => state.intl.locale);
  const [, setSelectedTools] = useAtom(compareToolsAtom);
  const ids = React.useMemo(
    () => getCompareUids(location.search),
    [location.search],
  );
  const appConfig = React.useMemo(
    () => ({ landingPageURL: '/en/navigator' }),
    [],
  );
  const landingPageURL = getLocalizedLandingPageURL(appConfig, currentLang);
  const backURL =
    location.state?.returnURL ||
    getReturnURL(location.search) ||
    landingPageURL;
  const [tools, setTools] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;

    const loadTools = async () => {
      setIsLoading(true);
      const results = await getTools(ids, currentLang);

      if (!ignore) {
        setTools(results);
        setIsLoading(false);
      }
    };

    if (ids.length >= 2) {
      loadTools();
    } else {
      setTools([]);
      setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [ids, currentLang]);

  const failedTools = tools.filter((tool) => tool.error);
  const visibleTools = tools.filter((tool) => !tool.error);
  const visibleToolsCount = visibleTools.length;
  const hasLoadedRequestedTools = tools.length === ids.length;
  const hasEnoughTools = visibleToolsCount >= 2;
  const allRequestedToolsFailed =
    ids.length >= 2 &&
    hasLoadedRequestedTools &&
    failedTools.length === ids.length;
  const someRequestedToolsFailed =
    failedTools.length > 0 && !allRequestedToolsFailed;
  const showNotEnoughTools =
    ids.length < 2 ||
    (!isLoading &&
      hasLoadedRequestedTools &&
      !hasEnoughTools &&
      !allRequestedToolsFailed);

  const removeTool = (toolId) => {
    const params = new URLSearchParams(location.search);
    const remainingIds = ids.filter((uid) => uid !== toolId);

    params.delete('uid');
    remainingIds.forEach((uid) => params.append('uid', uid));

    setSelectedTools((selectedTools) =>
      selectedTools.filter((tool) => tool.uid !== toolId),
    );

    history.push({
      pathname: location.pathname,
      search: params.toString() ? `?${params.toString()}` : '',
      hash: location.hash,
      state: location.state,
    });
  };

  return (
    <div className="navigator-catalogue-compare-view">
      <Helmet title={intl.formatMessage(messages.compareTools)} />
      <BodyClass className="navigator-catalogue-compare-page" />

      <Container>
        <div className="compare-page-header">
          <h2>
            {intl.formatMessage(messages.comparingTools, {
              count: visibleToolsCount,
            })}
          </h2>

          <div className="compare-page-actions">
            <Button
              className="primary inverted icon"
              onClick={() => history.push(backURL)}
            >
              <Icon className="ri-arrow-left-line" />
              {intl.formatMessage(messages.backToResults)}
            </Button>
            <Button
              className="primary inverted"
              disabled={!hasEnoughTools}
              onClick={() => exportComparisonTable(visibleTools, getToolField)}
            >
              <Icon className="ri-download-2-line" />
              {intl.formatMessage(messages.exportTable)}
            </Button>
          </div>
        </div>

        {showNotEnoughTools && (
          <Message>{intl.formatMessage(messages.notEnoughTools)}</Message>
        )}

        {isLoading && <Loader active inline="centered" />}

        {!isLoading && allRequestedToolsFailed && (
          <Message error>{intl.formatMessage(messages.allToolsFailed)}</Message>
        )}

        {!isLoading && someRequestedToolsFailed && (
          <Message warning>{intl.formatMessage(messages.toolsSkipped)}</Message>
        )}

        {!isLoading && hasEnoughTools && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <span className="compare-criteria-label">
                    {intl.formatMessage(messages.criteria)}
                  </span>
                </Table.HeaderCell>
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
                            className="ui button primary icon compare-tool-open"
                            href={tool.href}
                          >
                            {intl.formatMessage(messages.openTool)}
                            <Icon className="ri-external-link-line" />
                          </ExternalLink>
                        )}
                        <Button
                          className="icon compare-tool-clear"
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
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.usability)}
                    </div>
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
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.functionality)}
                    </div>
                    <div className="compare-criteria-helper">
                      2 lines about what functionality means
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`functionality-${tool.id}`}>
                    <div className="compare-functionality-dots">
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
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.spatialScale)}
                    </div>
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
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.outputType)}
                    </div>
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
                      {intl.formatMessage(messages.adaptationSupportCycleStep)}
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
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.sector)}
                    </div>
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
