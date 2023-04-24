import React from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';

const RelevantAceContentView = (props) => {
  const { data } = props;
  const { title, _v_results, items } = data;
  const results = _v_results || [];

  // console.log(data);

  return (
    <div className="block relevant-acecontent-block">
      {title && <h4>{title}</h4>}
      {items && items.length > 0 ? (
        <>
          {items.map((item, index) => (
            <List.Item key={index}>
              <Link to={flattenToAppURL(item.link)}>{item.item_title}</Link>
            </List.Item>
          ))}
        </>
      ) : (
        <>
          {results.map((result, index) => (
            <List.Item key={index} title={result[1]}>
              <Link to={flattenToAppURL(result[4])}>{result[0]}</Link>
            </List.Item>
          ))}
        </>
      )}
    </div>
  );
};

export default RelevantAceContentView;
