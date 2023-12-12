import React from 'react';
import './styles.less';
import ContextNavigation from './ContextNavigation';

export default function RASTView(props) {
  const { data } = props;
  let root_path = data?.root_path;
  let top_level = 1;
  if (typeof root_path === 'undefined') {
    root_path = '/';
  }
  top_level = (root_path.match(/\//g) || []).length - 1;

  return (
    <div className="block rast-block">
      <ContextNavigation
        params={{
          // name: 'CurrentTitle',
          // includeTop: false,
          // currentFolderOnly: false,
          topLevel: top_level,
          // topLevel: 2,
          // rootPath: '/en/about/test-rast/',
        }}
        location={{
          pathname: root_path,
        }}
      />
    </div>
  );
}
