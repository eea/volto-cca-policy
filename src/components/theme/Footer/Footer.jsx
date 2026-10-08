/**
 * Policy Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import EEAFooter from '@eeacms/volto-eea-design-system/ui/Footer/Footer';
import config from '@plone/volto/registry';
import isArray from 'lodash/isArray';
import messages from '@eeacms/volto-cca-policy/messages';

const footerMessages = [
  messages.sitemap,
  messages.managedBy,
  messages.exploreEnvironmentalInformationSystems,
  messages.about,
  messages.aboutUs,
  messages.contact,
  messages.contactUs,
  messages.help,
  messages.privacy,
  messages.privacyStatement,
  messages.accessibility,
  messages.legalNotice,
  messages.dashboard,
  messages.login,
  messages.cmsLogin,
].reduce((result, message) => ({ ...result, [message.id]: message }), {});

const Footer = () => {
  const intl = useIntl();
  const { eea } = config.settings;
  const {
    footerActions,
    copyrightActions,
    socialActions,
    contactActions,
    contactExtraActions,
  } = useSelector(
    (state) => ({
      footerActions: state.actions?.actions?.footer_actions,
      copyrightActions: state.actions?.actions?.copyright_actions,
      socialActions: state.actions?.actions?.social_actions,
      contactActions: state.actions?.actions?.contact_actions,
      contactExtraActions: state.actions?.actions?.contact_extra_actions,
    }),
    shallowEqual,
  );

  const translate = (text) =>
    footerMessages[text] ? intl.formatMessage(footerMessages[text]) : text;

  // ZMI > portal_actions > footer_actions
  const actions = isArray(footerActions)
    ? footerActions.map((action) => ({
        title: translate(action.title),
        url: flattenToAppURL(action.url),
      }))
    : eea.footerOpts.actions?.map((action) => ({
        ...action,
        title: translate(action.title),
      }));

  // ZMI > portal_actions > copyright_actions
  const copyright = isArray(copyrightActions)
    ? copyrightActions.map((action) => ({
        title: translate(action.title),
        site: translate(action.title),
        url: flattenToAppURL(action.url),
      }))
    : eea.footerOpts.copyright?.map((action) => ({
        ...action,
        title: translate(action.title),
        site: translate(action.site),
      }));

  // ZMI > portal_actions > social_actions
  const social = isArray(socialActions)
    ? socialActions.map((action) => ({
        name: action.id,
        icon: action.icon,
        url: action.url,
      }))
    : eea.footerOpts.social;

  // ZMI > portal_actions > contact_actions
  const contacts = isArray(contactActions)
    ? contactActions.map((action, idx) => ({
        text: translate(action.title),
        icon: action.icon,
        url: flattenToAppURL(action.url),
        children:
          idx === 0
            ? (contactExtraActions || []).map((child) => ({
                text: translate(child.title),
                icon: child.icon,
                url: flattenToAppURL(child.url),
              }))
            : [],
      }))
    : eea.footerOpts.contacts?.map((contact) => ({
        ...contact,
        text: translate(contact.text),
        children: contact.children?.map((child) => ({
          ...child,
          text: translate(child.text),
        })),
      }));

  // Update options with actions from backend
  const options = {
    ...eea.footerOpts,
    social,
    contacts,
  };

  return (
    <EEAFooter>
      <EEAFooter.Header>
        {translate(eea.footerOpts.logosHeader)}
      </EEAFooter.Header>
      <EEAFooter.SubFooter {...options} />
      <EEAFooter.Header>{translate(eea.footerOpts.header)}</EEAFooter.Header>
      <EEAFooter.SitesButton
        buttonName={translate(eea.footerOpts.buttonName)}
        hrefButton={eea.footerOpts.hrefButton}
      />
      <EEAFooter.Social {...options} />
      <EEAFooter.Actions actions={actions} copyright={copyright} />
    </EEAFooter>
  );
};

export default Footer;
