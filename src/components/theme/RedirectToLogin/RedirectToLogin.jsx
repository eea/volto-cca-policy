import React from 'react';

export default function RedirectToLogin(props) {
  const { token, location, history } = props;
  const { pathname, search } = location;

  React.useEffect(() => {
    if (!token) {
      const back = encodeURIComponent(`${pathname}${search}`);
      history.push(`/login?return_url=${back}`);
    }
  }, [token, history, pathname, search]);

  return null;
}
