import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

const ShareInfo = (props) => {
  const currentLang = useSelector((state) => state.intl.locale);

  return (
    <>
      <div className="share-info">
        <Link to={`/${currentLang + '/help/share-your-info'}`}>
          <Button icon primary labelPosition="left">
            Share your information
            <Icon name="right arrow" />
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ShareInfo;
