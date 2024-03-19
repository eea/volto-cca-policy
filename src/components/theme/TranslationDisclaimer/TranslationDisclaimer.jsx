import React from 'react';
import {
  Message,
  MessageHeader,
  Icon,
  Button,
  Container,
} from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import LanguagePreference from './LanguagePreference';

const TranslationDisclaimer = (props) => {
  const { defaultLanguage } = config.settings;
  const currentLanguage = useSelector((state) => state.intl.locale);
  const [isReadMore, setIsReadMore] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  return (
    <div className="translation-info">
      <LanguagePreference />
      {open && currentLanguage !== defaultLanguage && (
        <Container>
          <Message warning>
            <MessageHeader>
              <h5>Exclusion of liability</h5>
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
              <span>
                This translation is generated by eTranslation, a machine
                translation tool provided by the European Commission.
              </span>{' '}
              {isReadMore && (
                <>
                  <p>
                    Machine translation can give you a basic idea of the content
                    in a language you understand. It is fully automated and
                    involves no human intervention. The quality and accuracy of
                    machine translation can vary significantly from one text to
                    another and between different language pairs. The European
                    Commission does not guarantee the accuracy and accepts no
                    liability for possible errors. Some content (such as images,
                    videos, files, etc.) may not be translated due to the
                    technical limitations of the system.
                  </p>
                  <p>
                    Don’t use eTranslation to translate EU legislation.
                    Authentic versions in the 24 official languages are
                    available on{' '}
                    <a href="https://eur-lex.europa.eu/homepage.html">
                      Eur-Lex
                    </a>
                    . See also the{' '}
                    <a href="https://ec.europa.eu/info/language-policy_en">
                      Europa language policy{' '}
                    </a>
                    and{' '}
                    <a href="https://ec.europa.eu/info/legal-notice_en">
                      legal notice
                    </a>{' '}
                    (includes privacy policy and copyright notice).
                  </p>
                </>
              )}
              {!isReadMore ? (
                <Button basic secondary onClick={() => setIsReadMore(true)}>
                  <strong>Show more</strong>
                </Button>
              ) : (
                <Button basic secondary onClick={() => setIsReadMore(false)}>
                  <strong>Show less</strong>
                </Button>
              )}
            </Message.Content>
          </Message>
        </Container>
      )}
    </div>
  );
};

export default TranslationDisclaimer;
