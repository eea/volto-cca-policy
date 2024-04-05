import React, { useEffect, useState, useRef } from 'react';
import { Icon, Button } from 'semantic-ui-react';

const TranslationInfo = (props) => {
  const { defaultLanguage, currentLanguage } = props;
  const [isReadMore, setIsReadMore] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeClass, setActiveClass] = useState('');
  const [elementHeight, setElementHeight] = useState(0);
  const [bottomPosition, setBottomPosition] = useState('-100');
  const elementRef = useRef(null);

  useEffect(() => {
    if (currentLanguage !== defaultLanguage) {
      setIsActive(true);
    }
  }, [currentLanguage, defaultLanguage]);

  useEffect(() => {
    isActive ? setActiveClass('active') : setActiveClass('');
  }, [isActive]);

  const updateElementHeight = () => {
    if (elementRef.current) {
      const height = elementRef.current.clientHeight;
      setElementHeight(`${height}`);
    }
  };

  useEffect(() => {
    const updateElementHeight = () => {
      if (elementRef.current) {
        const height = elementRef.current.clientHeight;
        setElementHeight(`${height}`);
      }
    };

    updateElementHeight();
  }, []);

  const toggleContent = () => {
    setTimeout(() => {
      updateElementHeight();
    }, 0);
    setIsReadMore(!isReadMore);
  };

  useEffect(() => {
    if ((!isReadMore && !isActive) || (isReadMore && !isActive)) {
      setBottomPosition(`-${elementHeight}`);
    } else {
      setBottomPosition(0);
    }
  }, [elementHeight, isActive, isReadMore]);

  return (
    <>
      <div
        ref={elementRef}
        className={`translation-toast warning ${activeClass}`}
        style={{
          bottom: `${bottomPosition}px`,
        }}
      >
        <div className="header">
          <h5>Exclusion of liability</h5>
          <Button
            onClick={() => setIsActive(false)}
            basic
            icon
            className="close-button"
            aria-label="Close"
          >
            <Icon className="ri-close-line"></Icon>
          </Button>
        </div>
        <div>
          <span>
            This translation is generated by eTranslation, a machine translation
            tool provided by the European Commission.
          </span>{' '}
          {isReadMore && (
            <>
              <p>
                Machine translation can give you a basic idea of the content in
                a language you understand. It is fully automated and involves no
                human intervention. The quality and accuracy of machine
                translation can vary significantly from one text to another and
                between different language pairs. The European Commission does
                not guarantee the accuracy and accepts no liability for possible
                errors. Some content (such as images, videos, files, etc.) may
                not be translated due to the technical limitations of the
                system.
              </p>
              <p>
                Don’t use eTranslation to translate EU legislation. Authentic
                versions in the 24 official languages are available on{' '}
                <a href="https://eur-lex.europa.eu/homepage.html">Eur-Lex</a>.
                See also the{' '}
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
          <Button basic icon onClick={() => toggleContent()}>
            {!isReadMore ? (
              <strong>Show more</strong>
            ) : (
              <strong>Show less</strong>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default TranslationInfo;
