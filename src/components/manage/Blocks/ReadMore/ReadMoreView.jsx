import React, { useRef, useState, useEffect } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { BodyClass } from '@plone/volto/helpers';
import cx from 'classnames';

import './style.less';

const ReadMoreView = (props) => {
  const { data, mode } = props;
  const isEditMode = mode === 'edit';
  const { label_opened, label_closed, label_position, height } = data;

  const [isReadMore, setIsReadMore] = useState(true);
  const [wrapperHeight, setWrapperHeight] = useState(height);
  const [mounted, setMounted] = useState(false);
  const readMoreRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wrap previous siblings (before "Read more" button) in a div
  useEffect(() => {
    if (isEditMode || !mounted) return;

    const button = readMoreRef.current;
    const wrapper = document.createElement('div');
    wrapper.className = 'panel-wrapper';
    const nodes = [];
    let prevElem = button.previousSibling;

    while (prevElem) {
      nodes.push(prevElem);
      prevElem = prevElem.previousSibling;
    }

    const section = document.getElementsByClassName('panel-wrapper');
    if (section.length > 0) return;

    nodes.reverse().forEach((e) => {
      wrapper.appendChild(e);
    });

    button.parentNode.insertBefore(wrapper, button);
  }, [mounted, readMoreRef, isEditMode]);

  // Set the wrapper height
  useEffect(() => {
    if (isEditMode || !mounted) return;
    const wrapper = document.querySelector('.panel-wrapper');
    if (wrapper) {
      wrapper.style.height = wrapperHeight;
    }
  }, [mounted, wrapperHeight, isEditMode]);

  useEffect(() => {
    isReadMore ? setWrapperHeight(height) : setWrapperHeight('auto');
  }, [height, isReadMore]);

  const toggleReadMore = () => {
    if (!isReadMore) {
      setTimeout(() => {
        const wrapper = document.querySelector('.panel-wrapper');
        if (wrapper) {
          wrapper.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsReadMore(!isReadMore);
  };

  return (
    <div
      ref={readMoreRef}
      id="read-more-button"
      className={cx('read-more-block', {
        left: label_position === 'left',
        right: label_position === 'right',
      })}
    >
      <BodyClass className={`${isReadMore ? 'closed' : 'opened'}`} />
      <Button basic icon primary onClick={toggleReadMore}>
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
