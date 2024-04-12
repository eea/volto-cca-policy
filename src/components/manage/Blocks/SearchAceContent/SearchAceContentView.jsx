import { List, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useIntl, FormattedMessage } from 'react-intl';

export default function SearchAceContentView(props) {
  const { data, mode } = props;
  const results = data._v_results || [];
  const intl = useIntl();

  return results && results.length > 0 ? (
    <div className="block search-acecontent-block">
      {data.title && <h4>{data.title}</h4>}
      <List>
        {results.map((result, index) => (
          <List.Item key={index}>
            <Link to={flattenToAppURL(result[2])}>
              {intl.formatMessage({ id: result[0], defaultMessage: result[0] })}{' '}
              ({result[1]})
            </Link>
          </List.Item>
        ))}
      </List>
      <Link
        to="/en/help/share-your-info"
        className="ui button icon left labeled primary"
      >
        <Icon name="ri-share-line" />
        <FormattedMessage
          id="Share your information"
          defaultMessage="Share your information"
        />
      </Link>
    </div>
  ) : mode === 'edit' ? (
    <div>
      <FormattedMessage id="No results" defaultMessage="No results" />
    </div>
  ) : null;
}
