import React from 'react';
import { List } from 'semantic-ui-react';
import cx from 'classnames';

const RASTWidgetView = ({ value, className }) => {
  return value && value.length > 0 ? (
    <span className={cx(className, 'widget')}>
      <List>
        {value.map((step, index) => (
          <List.Item key={index}>{step.title}</List.Item>
        ))}
      </List>
    </span>
  ) : (
    ''
  );
};
export default RASTWidgetView;
