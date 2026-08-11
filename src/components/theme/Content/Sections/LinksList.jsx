import { ListItem, List } from 'semantic-ui-react';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';

export const ExternalLink = (props) => {
  let { url, text } = props;

  if (text === undefined) {
    text = url;
  }

  return <a href={url}>{text}</a>;
};

const LinksList = (props) => {
  let { value, withText, isInternal } = props;

  if (isInternal === undefined) {
    isInternal = false;
  }

  if (withText === true) {
    return (
      <List>
        {value.map((linkItem) => (
          <ListItem key={linkItem[0]}>
            {isInternal ? (
              <UniversalLink href={linkItem[0]}>{linkItem[1]}</UniversalLink>
            ) : (
              <ExternalLink url={linkItem[0]} text={linkItem[1]} />
            )}
          </ListItem>
        ))}
      </List>
    );
  } else {
    return (
      <List>
        {value.map((url) => (
          <ListItem key={url}>
            <ExternalLink url={url} text={url} />
          </ListItem>
        ))}
      </List>
    );
  }
};

export default LinksList;
