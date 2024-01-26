import React from 'react';
import { getBaseUrl } from '@plone/volto/helpers';
import { Breadcrumb } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { langmap } from '@plone/volto/helpers';

import ContentsBreadcrumbsRootItem from '@plone/volto/components/manage/Contents/ContentsBreadcrumbsRootItem';
import ContentsBreadcrumbsHomeItem from '@plone/volto/components/manage/Contents/ContentsBreadcrumbsHomeItem';

import config from '@plone/volto/registry';
import { getPhysicalBreadcrumbs } from '@eeacms/volto-cca-policy/store';

const messages = defineMessages({
  home: {
    id: 'Home',
    defaultMessage: 'Home',
  },
  root: {
    id: 'Root',
    defaultMessage: 'Root',
  },
});

const ContentsBreadcrumbs = () => {
  const { settings } = config;
  const items = useSelector((state) => state.physicalBreadcrumbs.items || []);
  const intl = useIntl();
  const pathname = useLocation().pathname;
  const lang = pathname.split('/')[1];
  const dispatch = useDispatch();

  React.useEffect(() => {
    const url = getBaseUrl(pathname);
    dispatch(getPhysicalBreadcrumbs(url));
  }, [dispatch, pathname]);

  return (
    <Breadcrumb>
      <Link
        to="/contents"
        className="section"
        title={intl.formatMessage(messages.root)}
      >
        <ContentsBreadcrumbsRootItem />
      </Link>
      {items.map((breadcrumb, index, breadcrumbs) => [
        <Breadcrumb.Divider key={`divider-${breadcrumb.url}`} />,
        index < breadcrumbs.length - 1 ? (
          <Link
            key={breadcrumb.url}
            to={`${breadcrumb.url}/contents`}
            className="section"
          >
            {breadcrumb.nav_title || breadcrumb.title}
          </Link>
        ) : (
          <Breadcrumb.Section key={breadcrumb.url} active>
            {breadcrumb.nav_title || breadcrumb.title}
          </Breadcrumb.Section>
        ),
      ])}
    </Breadcrumb>
  );
};

export default ContentsBreadcrumbs;
