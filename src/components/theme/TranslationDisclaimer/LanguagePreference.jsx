import React from 'react';
import {
  Message,
  MessageHeader,
  Icon,
  Button,
  Container,
} from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const location = useLocation();
  const [selectedLanguage] = useAtom(selectedLanguageAtom);
  const [showLangPref, setShowLangPref] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const currentLang = useSelector((state) => state.intl.locale);
  const search = ['/data-and-downloads', '/advanced-search'];
  const isSearchPage = search.some((el) => location.pathname.includes(el));

  const handlePageReload = () => {
    const pathname = location.pathname;
    const newPathname = pathname.replace(currentLang, selectedLanguage);
    window.location.replace(newPathname);
  };

  React.useEffect(() => {
    if (selectedLanguage && currentLang !== selectedLanguage) {
      const timeout = setTimeout(() => {
        setShowLangPref(true);
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentLang, selectedLanguage]);

  return !isSearchPage && showLangPref ? (
    <>
      {open && (
        <div className="translation-preference">
          <Container>
            <Message info>
              <MessageHeader>
                <h5>Language preference detected</h5>
                <Button
                  onClick={() => setOpen(!open)}
                  basic
                  icon
                  className="close-button"
                  aria-label="Close"
                >
                  <Icon className="ri-close-line"></Icon>
                </Button>
              </MessageHeader>
              <Message.Content>
                <p>
                  Do you want to see the page translated into{' '}
                  <strong>{language_names[selectedLanguage]}</strong>?{' '}
                  <Button basic onClick={() => handlePageReload()}>
                    <strong>
                      Yes, reload the page using my language settings.
                    </strong>
                  </Button>
                </p>
              </Message.Content>
            </Message>
          </Container>
        </div>
      )}
    </>
  ) : null;
};

export default LanguagePreference;
