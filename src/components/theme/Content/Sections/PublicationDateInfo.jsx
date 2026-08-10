import { defineMessages, useIntl } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import {
  GUIDANCE,
  INDICATOR,
  PUBLICATION_REPORT,
  VIDEO,
} from '@eeacms/volto-cca-policy/constants';

const messages = defineMessages({
  default_info_tooltip: {
    id:
      'The date refers to the moment in which the item has been prepared ' +
      'or updated by contributing experts to be submitted for the publication ' +
      'in Climate ADAPT',
    defaultMessage:
      'The date refers to the moment in which the item has been prepared ' +
      'or updated by contributing experts to be submitted for the publication ' +
      'in Climate ADAPT',
  },
  release_info_tooltip: {
    id: 'The date refers to the date of release of the video',
    defaultMessage: 'The date refers to the date of release of the video',
  },
  publication_info_tooltip: {
    id: 'The date refers to the latest date of publication of the item',
    defaultMessage:
      'The date refers to the latest date of publication of the item',
  },
});

const PublicationDateInfo = ({ value, portaltype, title }) => {
  const intl = useIntl();
  const publicationYear = new Date(value).getFullYear();

  const tooltipMessages = {
    [VIDEO]: intl.formatMessage(messages.release_info_tooltip),
    [GUIDANCE]: intl.formatMessage(messages.publication_info_tooltip),
    [INDICATOR]: intl.formatMessage(messages.publication_info_tooltip),
    [PUBLICATION_REPORT]: intl.formatMessage(messages.publication_info_tooltip),
    default: intl.formatMessage(messages.default_info_tooltip),
  };

  const tooltipText = tooltipMessages[portaltype] || tooltipMessages.default;

  if (publicationYear <= 1970) return null;

  return (
    <>
      <h5>{title}</h5>
      <p>
        {publicationYear}
        <Popup
          content={tooltipText}
          trigger={<i className="ri-question-fill"></i>}
        />
      </p>
    </>
  );
};

export default PublicationDateInfo;
