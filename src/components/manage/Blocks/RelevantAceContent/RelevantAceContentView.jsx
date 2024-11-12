import React from 'react';
import { List, ListItem, ListContent, ListIcon } from 'semantic-ui-react';
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
    <ListItem key={index}>
      <ListIcon name="angle right" />
      <ListContent>
        <Link to={flattenToAppURL(item.source?.[0]?.['@id'] || '/')}>
          {item.item_title}
        </Link>
      </ListContent>
    </ListItem>
  ));
  const resultsList = results.map((result, index) => (
    <ListItem key={index} title={result[1]}>
      <ListIcon name="angle right" />
      <ListContent>
        <Link to={flattenToAppURL(result[4])}>{result[0]}</Link>
      </ListContent>
    </ListItem>
  ));
  const showResults = hasAnyFilter || search_text != null;

  return showBlock ? (
    <div className="block relevant-acecontent-block">
      {title && <h4>{title}</h4>}

      {combine_results ? (
        <List>
          {itemList}
          {!isEdit && showResults && resultsList}
        </List>
      ) : items && items.length > 0 ? (
        <List>{itemList}</List>
      ) : (
        <List>{!isEdit && showResults && resultsList}</List>
      )}
    </div>
  ) : (
    <>{isEdit && <div>No items</div>}</>
  );
};

export default RelevantAceContentView;
