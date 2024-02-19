// Original: https://github.com/plone/volto/blob/16.x.x/src/components/theme/Widgets/RichTextWidget.jsx
// Fixed 'dangerouslySetInnerHTML' did not match. Server: "" Client: "<p>This is my paragraph.</p>" error
// replaced <p> to <div>, the value can already be wrapped in <p> and nested <p> in invalid HTML

import React from 'react';
import cx from 'classnames';

const RichTextWidget = ({ value, className }) =>
  value ? (
    <div
      className={cx(className, 'richtext', 'widget')}
      dangerouslySetInnerHTML={{
        __html: value.data,
      }}
    />
  ) : (
    ''
  );

export default RichTextWidget;
