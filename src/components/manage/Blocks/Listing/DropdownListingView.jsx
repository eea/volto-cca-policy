import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useIntl, defineMessages } from 'react-intl';

import './styles.less';

const messages = defineMessages({
  select: {
    id: 'Select',
    defaultMessage: 'Select',
  },
});

const getDropdownOptions = (items) => {
  const options = items?.map((item) => {
    return {
      key: item.id,
      value: item.id,
      text: item.title,
      as: Link,
      to: flattenToAppURL(item['@id']),
    };
  });
  return options;
};

const DropdownListingView = (data) => {
  const intl = useIntl();
  const { items = [], placeholder_text } = data;
  const options = getDropdownOptions(items);

  return (
    <Dropdown
      selection
      placeholder={placeholder_text || intl.formatMessage(messages.select)}
      options={options}
    />
  );
};

DropdownListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default DropdownListingView;
