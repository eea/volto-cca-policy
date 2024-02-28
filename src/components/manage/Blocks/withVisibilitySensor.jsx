import React from 'react';
import ReactVisibilitySensor from 'react-visibility-sensor';

const withVisibilitySensor = (options) => (WrappedComponent) => {
  const defaultOptions = {
    scrollCheck: true,
    resizeCheck: true,
    partialVisibility: true,
    delayedCall: true,
    offset: { top: -50, bottom: -50 },
    enabled: true,
    Placeholder: () => <div>&nbsp;</div>,
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  const {
    scrollCheck,
    resizeCheck,
    partialVisibility,
    offset,
    Placeholder,
    delayedCall,
    enabled,
  } = mergedOptions;

  function WithVisibilitySensor(props) {
    const [active, setActive] = React.useState(enabled);
    return (
      <ReactVisibilitySensor
        scrollCheck={scrollCheck}
        resizeCheck={resizeCheck}
        partialVisibility={partialVisibility}
        delayedCall={delayedCall}
        onChange={(visible) => {
          if (visible && active) {
            setActive(false);
          }
        }}
        active={active}
        getDOMElement={(val) => {
          return val?.el;
        }}
        offset={offset}
      >
        {({ isVisible }) => {
          if (isVisible || !active) {
            return <WrappedComponent {...props} />;
          }

          return <Placeholder {...props} />;
        }}
      </ReactVisibilitySensor>
    );
  }

  return WithVisibilitySensor;
};

export default withVisibilitySensor;
