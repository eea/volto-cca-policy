export const langRedirection = ({ dispatch, getState }) => (next) => (
  action,
) => {
  if (typeof action === 'function') {
    return next(action);
  }

  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      const state = getState();
      const locale = state.intl.locale || 'en';
      const { pathname } = action.payload.location;

      if (locale !== 'en' && pathname.indexOf('/en/') > -1) {
        action.payload.location.pathname = pathname.replaceAll(
          '/en/',
          `/${locale}/`,
        );
        dispatch;
        // console.log('here', locale, pathname, action);
        // dispatch(action);
        window.location.replace(action.payload.location.pathname);
      } else {
        return next(action);
      }

      break;
    default:
      return next(action);
  }
};
