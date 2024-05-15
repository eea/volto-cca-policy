import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { useIntl, defineMessages } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';

const messages = defineMessages({
  select: {
    id: 'Select',
    defaultMessage: 'Select',
  },
});

const getDropdownOptions = (items) => {
  const options = items?.map((item) => {
    const source = item?.source?.[0];
    return {
      key: source?.id,
      value: source?.id,
      text: item.item_title,
      as: Link,
      to: flattenToAppURL(source?.['@id']),
    };
  });
  return options;
};

const DropdownListView = (props) => {
  const intl = useIntl();
  const { title, items = [], variation } = props;
  const options = getDropdownOptions(items);

  return (
    items &&
    items.length > 0 && (
      <div className={`block content-links ${variation}-view`}>
        {title && <h4>{title}</h4>}
        <Dropdown
          selection
          placeholder={intl.formatMessage(messages.select)}
          options={options}
        />
      </div>
    )
  );
};

export default DropdownListView;
