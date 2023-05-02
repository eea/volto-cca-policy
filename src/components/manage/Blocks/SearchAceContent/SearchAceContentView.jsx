import { List, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';

export default function SearchAceContentView(props) {
  const { data } = props;
  const results = data._v_results || [];

  // console.log(data);

  return results && results.length > 0 ? (
    <div className="block search-acecontent-block">
      {data.title && <h4>{data.title}</h4>}
      <List>
        {results.map((result, index) => (
          <List.Item key={index}>
            <Link to={flattenToAppURL(result[2])}>
              {result[0]} ({result[1]})
            </Link>
          </List.Item>
        ))}
      </List>
      <Link
        to="/en/help/share-your-info"
        className="ui button icon left labeled primary"
      >
        <Icon name="ri-share-line" />
        Share your information
      </Link>
    </div>
  ) : (
    <div>No results</div>
  );
}
