import React from 'react';

const withResponsiveContainer = (className) => (WrappedComponent) => {
  return (props) => {
    const [size, setSize] = React.useState();
    const klass = className ? `${className} sized-wrapper` : 'sized-wrapper';
    return (
      <div
        className={klass}
        ref={(node) => {
          // console.log(node, node.clientHeight);
          if (node && !size)
            setSize({ height: node.clientHeight, width: node.clientWidth });
        }}
      >
        {size ? <WrappedComponent size={size} {...props} /> : null}
      </div>
    );
  };
};

export default withResponsiveContainer;
