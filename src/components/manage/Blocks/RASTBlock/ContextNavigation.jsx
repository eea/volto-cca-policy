import React from 'react';
import { compose } from 'redux';

import RASTAccordion from './RASTAccordion';
import { useLocation } from 'react-router-dom';
import loadable from '@loadable/component';

const RASTMap = loadable(() => import('./RASTMap'));

/**
 * A navigation slot implementation, similar to the classic Plone navigation
 * portlet. It uses the same API, so the options are similar to
 * INavigationPortlet
 */
export function ContextNavigationComponent(props) {
  const curentLocation = useLocation();
  const { location, items, skip_items, show_subfolders } = props;
  const [activeMenu, setActiveMenu] = React.useState(null);

  React.useEffect(() => {
    let newItems = [...items];
    let activeIndex = null;

    for (let i = 0; i < newItems.length; i++) {
      let itemUrl = '/' + newItems[i]['@id'].split('/').slice(3).join('/');
      if (curentLocation.pathname.includes(itemUrl)) {
        activeIndex = i;
      }
    }

    setActiveMenu(activeIndex);
  }, [curentLocation, items]);

  return (
    <>
      <RASTMap
        items={items}
        skip_items={skip_items}
        pathname={location.pathname}
        activeMenu={activeMenu}
      />
      {items.length ? (
        <RASTAccordion
          items={items}
          show_subfolders={show_subfolders}
          curent_location={curentLocation}
          activeMenu={activeMenu}
        />
      ) : null}
    </>
  );
}

// withContentNavigation
export default compose()(ContextNavigationComponent);
