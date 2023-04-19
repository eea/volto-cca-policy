import React from 'react';

const RelevantAceContentView = (props) => {
  const { data } = props;

  return (
    <div className="relevant-acecontent-block">
      Relevant acecontent view
      {(data.items || []).map((item, index) => (
        <div key={index}>{item.item_title}</div>
      ))}
      {data.title && <h4>{data.title}</h4>}
    </div>
  );
};

export default RelevantAceContentView;
