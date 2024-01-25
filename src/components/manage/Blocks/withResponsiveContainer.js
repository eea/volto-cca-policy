import React from 'react';

const withResponsiveContainer = (WrappedComponent) => {
  return (props) => {
    const [size, setSize] = React.useState();
    return (
      <div
        className="sized-wrapper"
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
