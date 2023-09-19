import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { BodyClass } from '@plone/volto/helpers';
import cx from 'classnames';

import './style.less';

const ReadMoreView = (props) => {
  const { data, mode } = props;
  const isEditMode = mode === 'edit';
  const { label_opened, label_closed, label_position, height } = data;

  const [isReadMore, setIsReadMore] = React.useState(true);
  const [wrapperHeight, setWrapperHeight] = React.useState(height);
  const [mounted, setMounted] = React.useState(false);
  const readMoreRef = React.createRef();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isEditMode || !mounted) return;

    const button = readMoreRef.current;
    const wrapper = document.createElement('div');
    wrapper.className = 'panel-wrapper';

    const nodes = [];
    let prev_elem = button.previousSibling;
    while (prev_elem) {
      nodes.push(prev_elem);
      prev_elem = prev_elem.previousSibling;
    }
    const section = document.getElementsByClassName('panel-wrapper');
    if (section.length > 0) return;

    Array.from(nodes).forEach((e) => {
      wrapper.appendChild(e);
    });

    button.parentNode.insertBefore(wrapper, button);
    wrapper.append(...Array.from(wrapper.childNodes).reverse());
  }, [mounted, readMoreRef, isEditMode]);

  React.useEffect(() => {
    if (isEditMode || !mounted) return;

    const wrapper = document.getElementsByClassName('panel-wrapper')[0];

    if (wrapper) {
      wrapper.style.height = wrapperHeight;
    }
  }, [mounted, wrapperHeight, isEditMode]);

  React.useEffect(() => {
    isReadMore ? setWrapperHeight(height) : setWrapperHeight('auto');
  }, [height, isReadMore]);

  return (
    <div
      ref={readMoreRef}
      id="read-more-button"
      className={cx('styled-readMoreBlock', {
        left: label_position === 'left',
        right: label_position === 'right',
      })}
    >
      <BodyClass className={`${isReadMore ? 'closed' : 'opened'}`} />
      <Button basic icon primary onClick={() => setIsReadMore(!isReadMore)}>
        {isReadMore ? (
          <>
            <strong>{label_closed || 'Read more'}</strong>
            <Icon className="ri-arrow-down-s-line" />
          </>
        ) : (
          <>
            <strong>{label_opened || 'Read less'}</strong>
            <Icon className="ri-arrow-up-s-line" />
          </>
        )}
      </Button>
    </div>
  );
};
export default ReadMoreView;
