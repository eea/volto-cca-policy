import React from 'react';
import { find } from 'lodash';
import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { Dropdown, Image } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { Header } from '@eeacms/volto-eea-design-system/ui';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';

import globeIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/global-line.svg';

import { selectedLanguageAtom } from '../../../state';

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

  const handlePageRedirect = (item) => {
    const searchParams = new URLSearchParams();
    const translation = find(translations, {
      language: item.code,
    });
    const url = translation
      ? flattenToAppURL(translation['@id'])
      : `/${item.code}`;

    setLanguage(item.code);
    setSelectedLanguage(item.code);
    searchParams.set('set_language', item.code);

    history.push({
      pathname: url,
      search: searchParams.toString(),
    });
  };

  // .filter((item) => eea.non_eu_langs.indexOf(item.code) !== -1)
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
        {eea.languages
          .filter((item) => eea.non_eu_langs.indexOf(item.code) === -1)
          .map((item, index) => {
            const translated = (translations || []).some(
              (obj) => obj.language === item.code,
            );
            const active = item.code === currentLang;
            const disabled = !translated && !active;

            return (
              <Dropdown.Item
                className={cx({
                  disabled: disabled,
                  active: active,
                })}
                as="li"
                key={index}
                text={
                  <span>
                    <span className="country-code">
                      {item.code.toUpperCase()}
                    </span>{' '}
                    {item.name}
                  </span>
                }
                onClick={(e) =>
                  disabled || active
                    ? e.preventDefault()
                    : handlePageRedirect(item)
                }
              ></Dropdown.Item>
            );
          })}
        <strong className="noneu-langs-label">
          <FormattedMessage
            id="Non-EU Languages"
            defaultMessage="Non-EU Languages"
          />
        </strong>

        {eea.languages
          .filter((item) => eea.non_eu_langs.indexOf(item.code) !== -1)
          .map((item, index) => {
            const translated = (translations || []).some(
              (obj) => obj.language === item.code,
            );
            const active = item.code === currentLang;
            const disabled = !translated && !active;

            return (
              <Dropdown.Item
                className={cx({
                  disabled: disabled,
                  active: active,
                })}
                as="li"
                key={index}
                text={
                  <span>
                    <span className="country-code">
                      {item.code.toUpperCase()}
                    </span>{' '}
                    {item.name}
                  </span>
                }
                onClick={(e) =>
                  disabled || active
                    ? e.preventDefault()
                    : handlePageRedirect(item)
                }
              ></Dropdown.Item>
            );
          })}
      </ul>
    </Header.TopDropdownMenu>
  );
}
