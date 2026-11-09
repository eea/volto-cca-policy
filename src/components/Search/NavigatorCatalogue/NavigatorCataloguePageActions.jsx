import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

const messages = defineMessages({
  about: {
    id: 'About',
    defaultMessage: 'About',
  },
  faq: {
    id: 'FAQ',
    defaultMessage: 'FAQ',
  },
});

const NavigatorCataloguePageActions = () => {
  const intl = useIntl();
  const currentLang = useSelector((state) => state.intl.locale || 'en');

  return (
    <div className="navigator-catalogue-page-actions">
      <Button
        as={Link}
        to={`/${currentLang}/navigator/about`}
        target="_blank"
        rel="noopener noreferrer"
        secondary
        inverted
        icon
        labelPosition="left"
      >
        <Icon className="ri-information-line" />
        {intl.formatMessage(messages.about)}
      </Button>
      <Button
        as={Link}
        to={`/${currentLang}/navigator/navigator-faq`}
        target="_blank"
        rel="noopener noreferrer"
        primary
        inverted
        icon
        labelPosition="left"
      >
        <Icon className="ri-question-line" />
        {intl.formatMessage(messages.faq)}
      </Button>
    </div>
  );
};

export default NavigatorCataloguePageActions;
