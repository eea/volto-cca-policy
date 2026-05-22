import React from 'react';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import cx from 'classnames';

export const LinkWrap = ({ item, pathname, children, className }) => {
  const substeps = item?.items || [];
  const activeSubstep = substeps.some((obj) => obj['@id'] === pathname);
  const activeStep = item ? pathname === item?.['@id'] : null;
  const isActive = activeStep || activeSubstep;
  return item ? (
    <UniversalLink item={item}>
      <g
        className={cx('step-link', className, {
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

export default LinkWrap;
