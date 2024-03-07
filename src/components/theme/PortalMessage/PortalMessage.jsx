import { Message, Icon } from 'semantic-ui-react';

const PortalMessage = (props) => {
  const { content } = props;
  const { review_state } = content;
  const isArchivedContent = review_state === 'archived';

  return isArchivedContent ? (
    <Message info icon>
      <Icon name="info" />
      <Message.Content>
        This object has been archived because its content is outdated. You can
        still access it as legacy.
      </Message.Content>
    </Message>
  ) : null;
};

export default PortalMessage;
