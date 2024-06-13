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
  return (
    items?.map((item, index) => {
      const source = item?.source?.[0];
      return {
        key: source?.id || index,
        value: source?.id,
        text: item.item_title,
        as: Link,
        to: flattenToAppURL(source?.['@id']),
      };
    }) || []
  );
};

const DropdownListView = (props) => {
  const intl = useIntl();
  const { title, items = [], variation, placeholder_text } = props;
  const options = getDropdownOptions(items);

  return (
    items &&
    items.length > 0 && (
      <div className={`block content-links ${variation}-view`}>
        {title && <h4>{title}</h4>}
        <Dropdown
          selection
          placeholder={placeholder_text || intl.formatMessage(messages.select)}
          options={options}
        />
      </div>
    )
  );
};

export default DropdownListView;
