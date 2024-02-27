/**
 * Login container.
 * @module components/theme/Sitemap/Sitemap
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { asyncConnect, Helmet } from '@plone/volto/helpers';
import { defineMessages, injectIntl } from 'react-intl';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import config from '@plone/volto/registry';
import { BannerTitle } from '@eeacms/volto-cca-policy/components';
import { getNavigation } from '@plone/volto/actions';

const messages = defineMessages({
  Sitemap: {
    id: 'Sitemap',
    defaultMessage: 'Sitemap',
  },
});

export function getSitemapPath(pathname = '', lang) {
  const prefix = pathname.replace(/\/sitemap$/gm, '').replace(/^\//, '');
  const path = prefix || lang || '';
  return path;
}

export const toReactIntlLang = (language) => {
  if (language.includes('_') || language.includes('-')) {
    let langCode = language.split(/[-_]/);
    langCode = `${langCode[0]}-${langCode[1].toUpperCase()}`;
    return langCode;
  }

  return language;
};
// export const toLangUnderscoreRegion = toReactIntlLang; // old name for backwards-compat

/**
 * Converts a language code like pt_BR or pt-BR to the format `pt-br`.
 * This format is used on the backend and in volto config settings.
 * @param {string} language Language to be converted
 * @returns {string} Language converted
 */
export const toBackendLang = (language) => {
  return toReactIntlLang(language).toLowerCase();
};

/**
 * Sitemap class.
 * @class Sitemap
 * @extends Component
 */
class Sitemap extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getNavigation: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { settings } = config;

    const lang = settings.isMultilingual
      ? `${toBackendLang(this.props.lang)}`
      : null;

    const path = getSitemapPath(this.props.location.pathname, lang);
    this.props.getNavigation(path, 4);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */

  renderItems = (items) => {
    return (
      <ul>
        {items.map((item) => (
          <li
            key={item.url}
            className={item.items?.length > 0 ? 'with-children' : ''}
          >
            <Link to={item.url}>{item.title}</Link>
            {item.items && this.renderItems(item.items)}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { items } = this.props;
    const content = {
      title: this.props.intl.formatMessage(messages.Sitemap),
    };
    return (
      <div id="page-sitemap">
        <Helmet title={this.props.intl.formatMessage(messages.Sitemap)} />
        <BannerTitle content={content} />
        <Container className="view-wrapper">
          {items && this.renderItems(items)}
        </Container>
      </div>
    );
  }
}

export const __test__ = compose(
  injectIntl,
  connect(
    (state) => ({
      items: state.navigation.items,
      lang: state.intl.locale,
    }),
    { getNavigation },
  ),
)(Sitemap);

export default compose(
  injectIntl,
  connect(
    (state) => ({
      items: state.navigation.items,
      lang: state.intl.locale,
    }),
    { getNavigation },
  ),
  asyncConnect([
    {
      key: 'navigation',
      promise: ({ location, store: { dispatch, getState } }) => {
        if (!__SERVER__) return;
        const { settings } = config;

        const path = getSitemapPath(
          location.pathname,
          settings.isMultilingual
            ? toBackendLang(getState().intl.locale)
            : null,
        );

        return dispatch(getNavigation(path, 4));
      },
    },
  ]),
)(Sitemap);
