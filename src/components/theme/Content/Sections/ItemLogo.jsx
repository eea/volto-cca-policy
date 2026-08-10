import { FormattedMessage } from 'react-intl';
import { Image } from 'semantic-ui-react';
import { VIDEO } from '@eeacms/volto-cca-policy/constants';

export const LogoWrapper = ({ logo, children }) =>
  logo ? <div className="has-logo">{children}</div> : children;

const ItemLogo = (props) => {
  const { content } = props;
  const type = content['@type'];
  const { logo, title } = content;

  return type !== VIDEO ? (
    <LogoWrapper logo={logo}>
      <h2>
        <FormattedMessage id="Description" defaultMessage="Description" />
      </h2>
      {logo && (
        <Image
          src={logo?.scales?.mini?.download}
          alt={title}
          className="db-logo"
        />
      )}
    </LogoWrapper>
  ) : null;
};

export default ItemLogo;
