import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { useAtom } from 'jotai';
import { selectedLanguageAtom } from './../../../state';

const language_names = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  pl: 'Polish',
};

const LanguagePreference = (props) => {
  const { currentLanguage, location } = props;
  const [selectedLanguage] = useAtom(selectedLanguageAtom);
  const search = ['/data-and-downloads', '/advanced-search'];
  const isSearchPage = search.some((el) => location.pathname.includes(el));

  const [showLangPref, setShowLangPref] = React.useState(false);
  const [active, setIsActive] = React.useState('');

  const handlePageReload = () => {
    const pathname = location.pathname;
    const newPathname = pathname.replace(currentLanguage, selectedLanguage);
    window.location.replace(newPathname);
  };

  React.useEffect(() => {
    if (selectedLanguage && currentLanguage !== selectedLanguage) {
      setShowLangPref(true);
    }
  }, [currentLanguage, selectedLanguage]);

  React.useEffect(() => {
    if (!isSearchPage && showLangPref) {
      let timeout = setTimeout(() => setIsActive('active'), 1200);
      return () => clearTimeout(timeout);
    }
  }, [isSearchPage, showLangPref]);

  return (
    <>
      <div className={`translation-toast info ${active}`}>
        <div className="header">
          <h5>Language preference detected</h5>
          <Button
            onClick={() => setIsActive('')}
            basic
            icon
            className="close-button"
            aria-label="Close"
          >
            <Icon className="ri-close-line"></Icon>
          </Button>
        </div>
        <div>
          <p>
            Do you want to see the page translated into{' '}
            <strong>{language_names[selectedLanguage]}</strong>?{' '}
            <Button basic onClick={() => handlePageReload()}>
              <strong>Yes, reload the page using my language settings.</strong>
            </Button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LanguagePreference;
