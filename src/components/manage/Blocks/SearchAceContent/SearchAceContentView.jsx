import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';

export default function SearchAceContentView(props) {
  const { data } = props;
  const results = data._v_results || [];

  return results && results.length > 0 ? (
    <div className="search-acecontent-block">
      {data.title && <h3>{data.title}</h3>}
      <List>
        {results.map((result, index) => (
          <List.Item key={index}>
            <Link to={flattenToAppURL(result[2])}>
              {result[0]} ({result[1]})
            </Link>
          </List.Item>
        ))}
      </List>
    </div>
  ) : (
    <div>No results</div>
  );
}
