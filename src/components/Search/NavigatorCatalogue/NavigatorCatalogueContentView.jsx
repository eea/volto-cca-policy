import React from 'react';
import { Sorting } from '@elastic/react-search-ui';
import { Icon, Menu } from 'semantic-ui-react';
import Paging from '@eeacms/search/components/Paging/Paging';
import ResultsPerPageSelector from '@eeacms/search/components/ResultsPerPageSelector/ResultsPerPageSelector';
import {
  ActiveFilterList,
  AnswerBox,
  Component,
  DownloadButton,
  DropdownFacetsList,
  SortingDropdownWithLabel,
} from '@eeacms/search/components';
import { useAppConfig, useViews } from '@eeacms/search/lib/hocs';
import { defineMessages, useIntl } from 'react-intl';

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
  const { appConfig, registry } = useAppConfig();
  const { children, wasInteracted } = props;
  const { activeViewId, setActiveViewId } = useViews();
  const { showFacets, showSorting, sortOptions, resultViews } = appConfig;
  const intl = useIntl();
  const translatedSortOptions = sortOptions.map((item) => ({
    ...item,
    name: messages[item.name?.id]
      ? intl.formatMessage(messages[item.name.id])
      : item.name,
  }));
  const navigatorResultViews = NAVIGATOR_VIEW_IDS.map((id) =>
    resultViews.find((view) => view.id === id),
  ).filter(Boolean);
  const activeNavigatorViewId = NAVIGATOR_VIEW_IDS.includes(activeViewId)
    ? activeViewId
    : navigatorResultViews[0]?.id;

  React.useEffect(() => {
    if (activeNavigatorViewId && activeViewId !== activeNavigatorViewId) {
      setActiveViewId(activeNavigatorViewId);
    }
  }, [activeNavigatorViewId, activeViewId, setActiveViewId]);

  const listingViewDef = resultViews.find(
    (view) => view.id === activeNavigatorViewId,
  );
  if (!listingViewDef) return null;

  const ResultViewComponent =
    registry.resolve[listingViewDef.factories.view].component;

  return (
    <>
      {appConfig.showFilters && <ActiveFilterList />}
      {appConfig.enableNLP ? <AnswerBox /> : ''}
      <div className="navigator-catalogue-above-results">
        <Menu pointing secondary className="navigator-view-tabs">
          {navigatorResultViews.map((view) => (
            <Menu.Item
              key={view.id}
              active={activeNavigatorViewId === view.id}
              onClick={() => setActiveViewId(view.id)}
            >
              {view.icon && <Icon name={view.icon} />}
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
                  label={''}
                  sortOptions={translatedSortOptions}
                  view={SortingDropdownWithLabel}
                />
              </>
            )}
          </div>
        </div>
      )}

      <ResultViewComponent>{children}</ResultViewComponent>

      <div className="row">
        <div className="search-body-footer">
          <div className="prev-next-paging">
            {wasInteracted ? <Paging /> : null}
          </div>
          <ResultsPerPageSelector />
          <div>
            <DownloadButton appConfig={appConfig} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigatorCatalogueContentView;
