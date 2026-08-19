import React from 'react';
import { useAtom } from 'jotai';
import { useDispatch, useSelector } from 'react-redux';
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
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { GET_BREADCRUMBS } from '@plone/volto/constants/ActionTypes';
import config from '@plone/volto/registry';
import { defineMessages, useIntl } from 'react-intl';
import BannerTitle from '../BannerTitle/BannerTitle';
import {
  MAX_COMPARE_TOOLS,
  compareToolsAtom,
  fetchResultsByUid,
  getCompareToolUid,
  getPathname,
} from './utils';
import {
  asArray,
  exportComparisonTable,
  formatFunctionalityScore,
  getLocalizedLandingPageURL,
} from '../../Search/NavigatorCatalogue/utils';

const messages = defineMessages({
  compareTools: {
    id: 'Compare tools',
    defaultMessage: 'Compare tools',
  },
  navigator: {
    id: 'Navigator',
    defaultMessage: 'Navigator',
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
  removeTool: {
    id: 'Remove {title} from comparison',
    defaultMessage: 'Remove {title} from comparison',
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

const getToolField = (tool, field) =>
  tool.result?.[field] ?? tool.result?._result?.[field];

const getToolFieldDisplay = (tool, field) =>
  asArray(getToolField(tool, field)).join(', ') || '—';

const FieldValueList = ({ value, label }) => {
  const values = asArray(value);

  return values.length ? (
    <ul className="compare-field-value-list" aria-label={label}>
      {values.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  ) : (
    '—'
  );
};

const FunctionalityScore = ({ value }) => {
  const label = formatFunctionalityScore(value);
  const score = Number(label.split('/')[0]);

  if (!Number.isFinite(score)) return <span>{label}</span>;

  return (
    <span className="functionality-dots" aria-label={label}>
      {Array.from({ length: 6 }, (_, index) => (
        <span
          aria-hidden="true"
          className={`functionality-dot${index < score ? ' filled' : ''}`}
          key={index}
        />
      ))}
    </span>
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

const getToolTitle = (result, fallback) =>
  result?.title || result?._result?.title?.raw || fallback;

const getToolHref = (result) => result?.href || result?._result?.id?.raw || '';

const getTools = async (uids, registry) => {
  try {
    const results = await fetchResultsByUid(uids, registry);
    const resultsByUid = new Map(
      results.map((result) => [getCompareToolUid(result), result]),
    );

    return uids.map((uid) => {
      const result = resultsByUid.get(uid);

      return {
        id: uid,
        title: getToolTitle(result, uid),
        href: getToolHref(result),
        result,
        error: !result,
      };
    });
  } catch {
    return uids.map((uid) => ({
      id: uid,
      title: uid,
      error: true,
    }));
  }
};

const CompareToolsView = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const currentLang = useSelector((state) => state.intl.locale);
  const [, setSelectedTools] = useAtom(compareToolsAtom);
  const ids = React.useMemo(
    () => getCompareUids(location.search),
    [location.search],
  );
  const registry = config.settings.searchlib;
  const appConfig = registry.searchui.navigatorCatalogueSearch;
  const landingPageURL = getLocalizedLandingPageURL(appConfig, currentLang);
  const compareToolsTitle = intl.formatMessage(messages.compareTools);
  const returnURL =
    location.state?.returnURL ||
    getReturnURL(location.search) ||
    landingPageURL;
  const backURL =
    getPathname(returnURL) === getPathname(landingPageURL)
      ? returnURL
      : landingPageURL;
  const breadcrumbParentTitle = intl.formatMessage(messages.navigator);
  const breadcrumbParentURL = backURL;
  const [tools, setTools] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    dispatch({ type: `${GET_BREADCRUMBS}_PENDING` });
    dispatch({
      type: `${GET_BREADCRUMBS}_SUCCESS`,
      manual: true,
      result: {
        root: `/${currentLang}`,
        items: [
          {
            title: breadcrumbParentTitle,
            '@id': breadcrumbParentURL,
          },
          {
            title: compareToolsTitle,
            '@id': location.pathname,
          },
        ],
      },
    });
  }, [
    breadcrumbParentTitle,
    breadcrumbParentURL,
    compareToolsTitle,
    currentLang,
    dispatch,
    location.pathname,
  ]);

  React.useEffect(() => {
    let ignore = false;

    const loadTools = async () => {
      setIsLoading(true);
      const results = await getTools(ids, registry);

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
  }, [ids, registry]);

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
      <Helmet title={compareToolsTitle} />
      <BodyClass className="navigator-catalogue-compare-page" />
      <BannerTitle content={{ title: compareToolsTitle }} />

      <Container>
        <div className="compare-page-header">
          <h3>
            {intl.formatMessage(messages.comparingTools, {
              count: visibleToolsCount,
            })}
          </h3>

          <div className="compare-page-actions">
            <Button onClick={() => history.push(backURL)}>
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
          <Table celled aria-label={compareToolsTitle} unstackable>
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
                      <div className="compare-tool-title-row">
                        <div
                          className="navigator-tool-icon medium"
                          aria-hidden="true"
                        >
                          <Icon className="ri-file-line" />
                        </div>
                        <div className="compare-tool-title" title={tool.title}>
                          {tool.title}
                        </div>
                      </div>
                      <div className="compare-tool-actions">
                        {tool.href && (
                          <UniversalLink
                            className="ui button primary icon compare-tool-open"
                            href={tool.href}
                          >
                            {intl.formatMessage(messages.openTool)}
                            <Icon className="ri-external-link-line" />
                          </UniversalLink>
                        )}
                        <Button
                          className="icon compare-tool-clear"
                          aria-label={intl.formatMessage(messages.removeTool, {
                            title: tool.title,
                          })}
                          onClick={() => removeTool(tool.id)}
                        >
                          <Icon className="ri-close-line" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell as="th" scope="row">
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.usability)}
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`usability-${tool.id}`}>
                    <div className="usability-value">
                      {getToolFieldDisplay(tool, 'accessibility_and_usability')}
                    </div>
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th" scope="row">
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.functionality)}
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`functionality-${tool.id}`}>
                    <div className="functionality-value">
                      <FunctionalityScore
                        value={getToolField(tool, 'functionality')}
                      />
                    </div>
                  </Table.Cell>
                ))}
              </Table.Row>
              {/* <Table.Row>
                <Table.Cell as="th" scope="row">
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.spatialScale)}
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`spatial-scale-${tool.id}`}>
                    {getToolFieldDisplay(tool, 'cca_geographical_scale')}
                  </Table.Cell>
                ))}
              </Table.Row> */}
              <Table.Row>
                <Table.Cell as="th" scope="row">
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.outputType)}
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`output-type-${tool.id}`}>
                    {getToolFieldDisplay(tool, 'cca_type_of_outputs')}
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th" scope="row">
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.adaptationSupportCycleStep)}
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`adaptation-support-cycle-step-${tool.id}`}>
                    <FieldValueList
                      label={intl.formatMessage(
                        messages.adaptationSupportCycleStep,
                      )}
                      value={getToolField(
                        tool,
                        'cca_adaptation_support_cycle_step',
                      )}
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell as="th" scope="row">
                  <div className="compare-criteria">
                    <div className="compare-criteria-title">
                      {intl.formatMessage(messages.sector)}
                    </div>
                  </div>
                </Table.Cell>
                {visibleTools.map((tool) => (
                  <Table.Cell key={`sector-${tool.id}`}>
                    <FieldValueList
                      label={intl.formatMessage(messages.sector)}
                      value={getToolField(tool, 'cca_adaptation_sectors')}
                    />
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

export default CompareToolsView;
