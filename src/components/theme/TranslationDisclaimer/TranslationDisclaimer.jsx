import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Segment } from 'semantic-ui-react';
import { isCmsUi } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

import LanguagePreference from './LanguagePreference';
import TranslationInfo from './TranslationInfo';

const TranslationDisclaimer = (props) => {
  const location = useLocation();
  const { defaultLanguage } = config.settings;
  const currentLanguage = useSelector((state) => state.intl.locale);
  const cmsView = isCmsUi(location.pathname);

  return cmsView ? null : (
    <Container className="toast-container">
      <Segment basic>
        <LanguagePreference
          currentLanguage={currentLanguage}
          location={location}
        />
        <TranslationInfo
          currentLanguage={currentLanguage}
          defaultLanguage={defaultLanguage}
        />
      </Segment>
    </Container>
  );
};

export default TranslationDisclaimer;
