import React from 'react';
// import { List } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
// import { flattenToAppURL } from '@plone/volto/helpers';
import ListingBody from '@plone/volto/components/manage/Blocks/Listing/ListingBody';

const FilterAceContentView = (props) => {
  const { data, id, mode = 'view' } = props;
  //   const { title } = data;
  //   const results = _v_results || [];
  const queryData = {
    block: id,
    querystring: {
      query: [
        {
          i: 'portal_type',
          o: 'plone.app.querystring.operation.selection.any',
          v: ['Document'],
        },
      ],
    },
    sort_order: 'ascending',
  };

  return (
    <div className="block filter-acecontent-block">
      Filter ace content view
      {data.title && <h4>{data.title}</h4>}
      <ListingBody
        id={id}
        data={queryData}
        path={props.path}
        isEditMode={mode === 'edit'}
        variation={null}
      />
    </div>
  );
};

export default FilterAceContentView;