import React from 'react';
import { Header } from '@eeacms/volto-eea-design-system/ui';
import { find } from 'lodash';
import globeIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/global-line.svg';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import { Dropdown, Image } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useAtom } from 'jotai';
import { selectedLanguageAtom } from './../../state';

// dispatch(changeLanguage(redirectToLanguage, locale.default));
export default function LanguageSwitch({ history }) {
  const { eea } = config.settings;
  const translations = useSelector(
    (state) => state.content.data?.['@components']?.translations?.items,
  );
  const [, setSelectedLanguage] = useAtom(selectedLanguageAtom);
  const width = useSelector((state) => state.screen?.width);

  const currentLang = useSelector((state) => state.intl.locale);
  const [language, setLanguage] = React.useState(
    currentLang || eea.defaultLanguage,
  );

  return (
    <Header.TopDropdownMenu
      id="language-switcher"
      className="item"
      hasLanguageDropdown={
        config.settings.supportedLanguages.length > 1 &&
        config.settings.hasLanguageDropdown
      }
      text={`${language.toUpperCase()}`}
      mobileText={`${language.toUpperCase()}`}
      icon={<Image src={globeIcon} alt="language dropdown globe icon"></Image>}
      viewportWidth={width}
    >
      <ul
        className="wrapper language-list"
        role="listbox"
        aria-label="language switcher"
      >
        {eea.languages.map((item, index) => (
          <Dropdown.Item
            as="li"
            key={index}
            text={
              <span>
                {item.name}
                <span className="country-code">{item.code.toUpperCase()}</span>
              </span>
            }
            onClick={() => {
              const translation = find(translations, {
                language: item.code,
              });
              const to = translation
                ? flattenToAppURL(translation['@id'])
                : `/${item.code}`;
              setLanguage(item.code);
              setSelectedLanguage(item.code);
              const searchParams = new URLSearchParams();
              searchParams.set('set_language', item.code);
              history.push({
                pathname: to,
                search: searchParams.toString(),
              });
            }}
          ></Dropdown.Item>
        ))}
      </ul>
    </Header.TopDropdownMenu>
  );
}
