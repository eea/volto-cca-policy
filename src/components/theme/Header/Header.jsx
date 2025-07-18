/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React from 'react';
import { Dropdown, Image } from 'semantic-ui-react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { UniversalLink } from '@plone/volto/components';
import {
  getBaseUrl,
  hasApiExpander,
  flattenToAppURL,
  toPublicURL,
  BodyClass,
} from '@plone/volto/helpers';
import { getNavigation } from '@plone/volto/actions';
import { Header, Logo } from '@eeacms/volto-eea-design-system/ui';
import { usePrevious } from '@eeacms/volto-eea-design-system/helpers';
import eeaFlag from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/eea.png';

import config from '@plone/volto/registry';
import { compose } from 'recompose';

import cx from 'classnames';
import loadable from '@loadable/component';

const LazyLanguageSwitcher = loadable(() => import('./LanguageSwitch'));

function removeTrailingSlash(path) {
  while (path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path;
}

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const DirectLinkLogo = ({
  src,
  invertedSrc,
  id,
  url,
  alt,
  title,
  inverted,
}) => {
  return (
    <a href={url} title={title} className={'logo'}>
      <Image
        src={inverted ? invertedSrc : src}
        alt={alt}
        title={title}
        className="eea-logo"
        id={id}
      />
    </a>
  );
};

/**
 * EEA Specific Header component.
 */
const EEAHeader = ({ pathname, token, items, history, subsite }) => {
  const router_pathname = useSelector((state) => {
    return removeTrailingSlash(state.router?.location?.pathname) || '';
  });

  const isSubsite = ['Folder', 'Subsite'].indexOf(subsite?.['@type']) > -1;

  const isHomePageInverse = useSelector((state) => {
    const layout = state.content?.data?.layout;
    const has_home_layout =
      layout === 'homepage_inverse_view' ||
      (__CLIENT__ && document.body.classList.contains('homepage-inverse'));

    return (
      has_home_layout &&
      (removeTrailingSlash(pathname) === router_pathname ||
        router_pathname.endsWith('/edit') ||
        router_pathname.endsWith('/add'))
    );
  });

  const { eea } = config.settings;
  const headerOpts = eea.headerOpts || {};
  const subsiteHeaderOpts = eea.subsiteHeaderOpts || {};
  const headerSearchBox = eea.headerSearchBox || [];
  const { logo, logoWhite } = headerOpts || {};
  const width = useSelector((state) => state.screen?.width);
  const dispatch = useDispatch();
  const previousToken = usePrevious(token);

  React.useEffect(() => {
    const { settings } = config;
    const base_url = getBaseUrl(pathname);

    // Check if navigation data needs to be fetched based on the API expander availability
    if (!hasApiExpander('navigation', base_url)) {
      dispatch(getNavigation(base_url, settings.navDepth));
    }

    // Additional check for token changes
    if (token !== previousToken) {
      dispatch(getNavigation(base_url, settings.navDepth));
    }
  }, [pathname, token, dispatch, previousToken]);

  const subsiteView = subsiteHeaderOpts.filter((v) =>
    router_pathname.match(v.matchpath),
  );
  const subsiteLogoWhite = subsiteView[0]?.logoWhite;

  const download = subsite?.subsite_logo?.scales?.preview?.download;
  const subsiteLogo = subsite?.subsite_logo
    ? download || toPublicURL(`${subsite['@id']}/@@images/subsite_logo`)
    : null;

  return (
    <Header menuItems={items}>
      {isHomePageInverse && <BodyClass className="homepage" />}
      <Header.TopHeader>
        <Header.TopItem className="official-union">
          <Image src={eeaFlag} alt="European Union flag"></Image>
          <Header.TopDropdownMenu
            text="An official website of the European Union | How do you know?"
            tabletText="EEA information systems"
            mobileText="EEA information systems"
            icon="chevron down"
            aria-label="dropdown"
            classNameHeader="mobile-sr-only"
            viewportWidth={width}
          >
            <div
              className="content"
              onClick={(evt) => evt.stopPropagation()}
              onKeyDown={(evt) => evt.stopPropagation()}
              tabIndex={0}
              role={'presentation'}
            >
              <p>
                All official European Union website addresses are in the{' '}
                <b>europa.eu</b> domain.
              </p>
              <a
                href="https://europa.eu/european-union/contact/institutions-bodies_en"
                target="_blank"
                rel="noopener"
                onKeyDown={(evt) => evt.stopPropagation()}
              >
                See all EU institutions and bodies
              </a>
            </div>
          </Header.TopDropdownMenu>
        </Header.TopItem>

        <div className="top-header-right-items">
          {!!headerOpts.partnerLinks && (
            <Header.TopItem>
              <Header.TopDropdownMenu
                id="theme-sites"
                text={headerOpts.partnerLinks.title}
                aria-label={headerOpts.partnerLinks.title}
                viewportWidth={width}
              >
                <div className="wrapper" tabIndex={0} role={'presentation'}>
                  {headerOpts.partnerLinks.links.map((item, index) => (
                    <Dropdown.Item key={index}>
                      <a
                        href={item.href}
                        className="site"
                        target="_blank"
                        rel="noopener"
                        onKeyDown={(evt) => evt.stopPropagation()}
                      >
                        {item.title}
                      </a>
                    </Dropdown.Item>
                  ))}
                </div>
              </Header.TopDropdownMenu>
            </Header.TopItem>
          )}

          {config.settings.isMultilingual &&
            config.settings.supportedLanguages.length > 1 &&
            config.settings.hasLanguageDropdown && (
              <LazyLanguageSwitcher width={width} history={history} />
            )}
        </div>
      </Header.TopHeader>
      <Header.Main
        pathname={pathname}
        isMultilingual={config.settings.isMultilingual}
        headerSearchBox={headerSearchBox}
        inverted={isHomePageInverse ? true : false}
        transparency={isHomePageInverse ? true : false}
        logo={
          <div className={isSubsite ? 'logo-wrapper' : ''}>
            {subsite?.title ? (
              <>
                {subsite.subsite_logo ? (
                  <Logo
                    src={
                      isHomePageInverse && subsiteLogoWhite
                        ? subsiteLogoWhite
                        : subsiteLogo
                    }
                    title={subsite.title}
                    alt={subsite.title}
                    url={flattenToAppURL(subsite['@id'])}
                  />
                ) : (
                  subsite.title
                )}
                <div className="subsite-logo">
                  <DirectLinkLogo
                    src={isHomePageInverse ? logoWhite : logo}
                    title={eea.websiteTitle}
                    alt={eea.organisationName}
                    url={eea.logoTargetUrl}
                  />
                </div>
              </>
            ) : (
              <Logo
                src={isHomePageInverse ? logoWhite : logo}
                title={eea.websiteTitle}
                alt={eea.organisationName}
                url={eea.logoTargetUrl}
              />
            )}
          </div>
        }
        menuItems={items}
        renderGlobalMenuItem={(item, { onClick }) => (
          <a
            href={item.url || '/'}
            title={item.title}
            onClick={(e) => {
              onClick(e, item);
            }}
          >
            {item.title}
          </a>
        )}
        renderMenuItem={(item, options, props) => (
          <UniversalLink
            openLinkInNewTab={false}
            href={item.nonclickable ? null : item.url || '/'}
            title={item.nav_title || item.title}
            {...(options || {})}
            className={cx(options?.className, {
              active: item.url === router_pathname,
              'item-nonclickable': item.nonclickable,
            })}
          >
            {props?.iconPosition !== 'right' && props?.children}
            <span>{item.nav_title || item.title}</span>
            {props?.iconPosition === 'right' && props?.children}
          </UniversalLink>
        )}
      ></Header.Main>
    </Header>
  );
};

export default compose(
  withRouter,
  connect(
    (state) => ({
      token: state.userSession.token,
      items: state.navigation.items,
      subsite: state.content.data?.['@components']?.subsite,
    }),
    { getNavigation },
  ),
)(EEAHeader);
