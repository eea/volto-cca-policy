import React from 'react';
import { Sorting } from '@elastic/react-search-ui';
import { Grid, Icon, Menu } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import { useAtomValue } from 'jotai';

import ResultsPerPageSelector from '@eeacms/search/components/ResultsPerPageSelector/ResultsPerPageSelector';
import Paging from '@eeacms/search/components/Paging/Paging';
import {
  ActiveFilterList,
  AnswerBox,
  Component,
  DownloadButton,
  DropdownFacetsList,
  SectionTabs,
  SortingDropdownWithLabel,
} from '@eeacms/search/components';
import { NoResults } from '@eeacms/search/components/Result/NoResults';
import { useSearchContext, useViews } from '@eeacms/search/lib/hocs';
import { loadingFamily } from '@eeacms/search/state';
import registry from '@eeacms/search/registry';
import { CompareToolsPanel } from '../../Result/NavigatorCatalogue/CompareToolsPanel';

const NAVIGATOR_VIEW_IDS = ['listing', 'map'];

const messages = defineMessages({
  'Title a-z': {
    id: 'Title a-z',
    defaultMessage: 'Title a-z',
  },
  'Title z-a': {
    id: 'Title z-a',
    defaultMessage: 'Title z-a',
  },
  Newest: {
    id: 'Newest',
    defaultMessage: 'Newest',
  },
  Oldest: {
    id: 'Oldest',
    defaultMessage: 'Oldest',
  },
  Relevance: {
    id: 'Relevance',
    defaultMessage: 'Relevance',
  },
});

const NavigatorCatalogueContentView = (props) => {
  const { appConfig, children, current, wasInteracted } = props;
  const { sortOptions, resultViews } = appConfig;
  const views = useViews();
  const searchContext = useSearchContext();
  const intl = useIntl();

  const { showFilters, showFacets, showClusters, showSorting } = appConfig;

  const navigatorResultViews = NAVIGATOR_VIEW_IDS.map((id) =>
    resultViews.find((view) => view.id === id),
  ).filter(Boolean);

  const activeNavigatorViewId = NAVIGATOR_VIEW_IDS.includes(views.activeViewId)
    ? views.activeViewId
    : navigatorResultViews[0]?.id;

  React.useEffect(() => {
    if (activeNavigatorViewId && views.activeViewId !== activeNavigatorViewId) {
      views.setActiveViewId(activeNavigatorViewId);
    }
  }, [activeNavigatorViewId, views]);

  const listingViewDef = resultViews.find(
    (view) => view.id === activeNavigatorViewId,
  );

  const ResultViewComponent =
    registry.resolve[listingViewDef?.factories.view]?.component;

  const layoutMode =
    activeNavigatorViewId === 'horizontalCard' ? 'fixed' : 'fullwidth';

  const { wasSearched } = searchContext;

  const loadingAtom = loadingFamily(appConfig.appName);
  const isLoading = useAtomValue(loadingAtom);

  const showPaging = appConfig.showLandingPage === false ? true : wasInteracted;

  const sortOptions2 = sortOptions.map((item) => ({
    ...item,
    name: messages[item.name?.id]
      ? intl.formatMessage(messages[item.name.id])
      : item.name,
  }));

  if (!ResultViewComponent) return null;

  return (
    <>
      {appConfig.mode === 'edit' && (
        <div>Active filters are always shown in edit mode</div>
      )}

      {(showFilters || appConfig.mode === 'edit') && <ActiveFilterList />}

      {showClusters && <SectionTabs />}

      <div className={`results-layout ${layoutMode}`}>
        <div className="navigator-catalogue-above-results">
          <Menu pointing secondary className="navigator-view-tabs">
            {navigatorResultViews.map((view) => (
              <Menu.Item
                key={view.id}
                active={activeNavigatorViewId === view.id}
                onClick={() => views.setActiveViewId(view.id)}
              >
                {view.icon && <Icon className={view.icon} />}
                {view.title}
              </Menu.Item>
            ))}
          </Menu>
        </div>

        {(showFacets || showSorting) && (
          <div className="above-results">
            <div className="above-left">
              {showFacets && <DropdownFacetsList />}
            </div>

            <div className="above-right">
              {showSorting && (
                <>
                  <Component factoryName="SecondaryFacetsList" {...props} />
                  <Sorting
                    label=""
                    sortOptions={sortOptions2}
                    view={SortingDropdownWithLabel}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {children.length === 0 && !isLoading && wasSearched && <NoResults />}

        {current === 1 && appConfig.mode !== 'edit' ? <AnswerBox /> : ''}

        <ResultViewComponent>{children}</ResultViewComponent>
        <CompareToolsPanel />

        {children.length > 0 && (
          <div className="search-body-footer">
            <Grid columns={2}>
              <Grid.Column>
                <ResultsPerPageSelector />
              </Grid.Column>
              <Grid.Column textAlign="right" />
            </Grid>

            <Grid centered>
              <Grid.Column textAlign="center">
                <div className="prev-next-paging">
                  {!!showPaging && <Paging />}
                </div>
                <div>
                  <DownloadButton appConfig={appConfig} />
                </div>
              </Grid.Column>
            </Grid>
          </div>
        )}
      </div>
    </>
  );
};

export default NavigatorCatalogueContentView;
