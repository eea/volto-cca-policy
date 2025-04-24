import React from 'react';
import { compose } from 'redux';

import RASTMap from './RASTMap';
import RASTAccordion from './RASTAccordion';
import { useLocation } from 'react-router-dom';

/**
 * A navigation slot implementation, similar to the classic Plone navigation
 * portlet. It uses the same API, so the options are similar to
 * INavigationPortlet
 */
export function ContextNavigationComponent(props) {
  const { location, items, skip_items, show_subfolders } = props;
  let activeMenu = null;

  const curent_location = useLocation();
  const curent_location_pathname = curent_location.pathname;
  for (let i = 0; i < items.length; i++) {
    let itemUrl = '/' + items[i]['@id'].split('/').slice(3).join('/');
    items[i].is_active = false;
    if (curent_location_pathname.includes(itemUrl)) {
      activeMenu = i;
      items[i].is_active = true;
    }
  }

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
          curent_location={curent_location}
          activeMenu={activeMenu}
        />
      ) : null}
    </>
  );
}

// withContentNavigation
export default compose()(ContextNavigationComponent);
