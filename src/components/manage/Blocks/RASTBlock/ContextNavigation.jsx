import React from 'react';
import { compose } from 'redux';

import RASTMap from './RASTMap';
import RASTAccordion from './RASTAccordion';
import { useLocation } from 'react-router-dom';

import { withContentNavigation } from '@plone/volto/components/theme/Navigation/withContentNavigation';

/**
 * A navigation slot implementation, similar to the classic Plone navigation
 * portlet. It uses the same API, so the options are similar to
 * INavigationPortlet
 */
export function ContextNavigationComponent(props) {
  const { navigation = {}, location } = props;
  const { items = [] } = navigation;
  let activeMenu = null;

  const curent_location = useLocation();
  for (let i = 0; i < items.length; i++) {
    let itemUrl = '/' + items[i].href.split('/').slice(3).join('/');
    items[i].is_active = false;
    if (curent_location.pathname.includes(itemUrl)) {
      activeMenu = i;
      items[i].is_active = true;
    }
  }

  return (
    <>
      <RASTMap
        items={items}
        pathname={location.pathname}
        activeMenu={activeMenu}
      />
      {items.length ? (
        <RASTAccordion datasets={items} activeMenu={activeMenu} />
      ) : null}
    </>
  );
}

export default compose(withContentNavigation)(ContextNavigationComponent);