import React from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';

const RelevantAceContentView = (props) => {
  const { data, mode = 'view' } = props;
  const {
    title,
    _v_results,
    items = [],
    combine_results,
    element_type,
    sector,
    search_type,
    special_tags,
    search_text,
  } = data;
  const results = _v_results || [];
  const isEdit = mode === 'edit' ? true : false;
  const hasAnyFilter = [element_type, sector, search_type, special_tags].some(
    (list) => list?.length > 0,
  );
  const showBlock = (items && items.length > 0) || results.length > 0;

  const itemList = (items || []).map((item, index) => (
    <List.Item key={index}>
      <Link to={flattenToAppURL(item.link)}>{item.item_title}</Link>
    </List.Item>
  ));
  const resultsList = results.map((result, index) => (
    <List.Item key={index} title={result[1]}>
      <Link to={flattenToAppURL(result[4])}>{result[0]}</Link>
    </List.Item>
  ));
  const showResults = hasAnyFilter || search_text != null;

  return showBlock ? (
    <div className="block relevant-acecontent-block">
      {title && <h4>{title}</h4>}

      {combine_results ? (
        <>
          {itemList}
          {!isEdit && showResults && resultsList}
        </>
      ) : items && items.length > 0 ? (
        itemList
      ) : (
        !isEdit && showResults && resultsList
      )}
    </div>
  ) : (
    <>{isEdit && <div>No items</div>}</>
  );
};

export default RelevantAceContentView;
