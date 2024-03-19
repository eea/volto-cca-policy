import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const ShareInfoButton = (props) => {
  const currentLang = useSelector((state) => state.intl.locale);

  return (
    <>
      <div className="share-info">
        <Link to={`/${currentLang + '/help/share-your-info'}`}>
          <Button icon primary labelPosition="left">
            <FormattedMessage
              id="Share your information"
              defaultMessage="Share your information"
            />
            <Icon name="right arrow" />
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ShareInfoButton;
