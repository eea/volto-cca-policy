import { FormattedMessage } from 'react-intl';
import { Message, Icon } from 'semantic-ui-react';

const PortalMessage = ({ content }) => {
  const { review_state } = content;
  const isArchivedContent = review_state === 'archived';

  return isArchivedContent ? (
    <Message info icon>
      <Icon name="info" />
      <Message.Content>
        <FormattedMessage
          id="This object has been archived because its content is outdated. You can still access it as legacy."
          defaultMessage="This object has been archived because its content is outdated. You can still access it as legacy."
        />
      </Message.Content>
    </Message>
  ) : null;
};

export default PortalMessage;
