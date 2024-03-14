import { createBrowserHistory } from 'history';

export const langRedirection = ({ dispatch, getState }) => (next) => (
  action,
) => {
  if (typeof action === 'function') {
    return next(action);
  }

  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      const { pathname } = action.payload.location;
      const state = getState();
      const browserHistory = createBrowserHistory();
      const locale = state.intl.locale || 'en';
      const search = ['/data-and-downloads', '/advanced-search'];
      const searchPageURL = search.some((el) => pathname.includes(el));

      if (locale !== 'en' && !searchPageURL && pathname.indexOf('/en/') > -1) {
        const newPathname = pathname.replaceAll('/en/', `/${locale}/`);
        action.payload.location.pathname = newPathname;
        browserHistory.replace(newPathname);
        // window.location.replace(newPathname);
      }
      return next(action);
    default:
      return next(action);
  }
};
