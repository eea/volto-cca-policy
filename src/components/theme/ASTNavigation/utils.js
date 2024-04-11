import { UniversalLink } from '@plone/volto/components';
import cx from 'classnames';

export const isAdaptationSupportToolURL = (url) => {
  return url.indexOf('/knowledge/tools/adaptation-support-tool') > -1;
};

export const isUrbanAdaptationSupportToolURL = (url) => {
  return url.indexOf('/knowledge/tools/urban-ast') > -1;
};

export const LinkWrap = ({ item, pathname, children }) => {
  const substeps = item?.items || [];
  const activeSubstep = substeps.some((obj) => obj['@id'] === pathname);
  const activeStep = item ? pathname === item?.['@id'] : null;
  const isActive = activeStep || activeSubstep;
  return item ? (
    <UniversalLink item={item}>
      <g
        className={cx('step-link', {
          active: isActive,
        })}
      >
        <title>{item.title}</title>
        {children}
      </g>
    </UniversalLink>
  ) : (
    <g>{children}</g>
  );
};
