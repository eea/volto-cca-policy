import React, { useEffect, useState } from 'react';

export default function withClientOnly(WrappedComponent) {
  const WithClientWrappedComponent = (props) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    if (!hasMounted) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithClientWrappedComponent;
}
