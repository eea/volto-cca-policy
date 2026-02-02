import React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

export default function CountryTabPane(props) {
  const { contents, _index, activePanes, setActivePanes } = props;
  return (
    <>
      <div>{contents}</div>
    </>
  );
}
