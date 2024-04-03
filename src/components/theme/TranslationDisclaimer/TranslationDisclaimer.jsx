import React from 'react';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import LanguagePreference from './LanguagePreference';
import TranslationInfo from './TranslationInfo';

const TranslationDisclaimer = (props) => {
  const { defaultLanguage } = config.settings;
  const currentLanguage = useSelector((state) => state.intl.locale);

  return (
    <div>
      <LanguagePreference currentLanguage={currentLanguage} />
      <TranslationInfo
        currentLanguage={currentLanguage}
        defaultLanguage={defaultLanguage}
      />
    </div>
  );
};

export default TranslationDisclaimer;
