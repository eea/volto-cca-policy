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
      const locale = state.intl.locale || 'en';
      const search = ['/data-and-downloads', '/advanced-search'];
      const isSearchPage = search.some((el) => pathname.includes(el));
      const queryString = action.payload.location.search;
      const urlParams = new URLSearchParams(queryString);
      const hasLanguageQueryParam = urlParams.has('set_language');

      if (
        locale !== 'en' &&
        !isSearchPage &&
        !hasLanguageQueryParam &&
        pathname.indexOf('/en/') > -1
      ) {
        const newPathname = pathname.replaceAll('/en/', `/${locale}/`);
        action.payload.location.pathname = newPathname;
        window.history.replaceState(window.history.state, '', newPathname);
      }
      return next(action);
    default:
      return next(action);
  }
};
