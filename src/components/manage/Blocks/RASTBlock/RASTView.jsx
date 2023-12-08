import React from 'react';
import './styles.less';
import ContextNavigation from './ContextNavigation';

export default function RASTView(props) {
  const { data } = props;
  const top_level = data?.top_level;

  return (
    <div className="block rast-block">
      <ContextNavigation
        params={{
          // name: 'CurrentTitle',
          includeTop: false,
          currentFolderOnly: false,
          topLevel: top_level ? top_level : 2,
          // rootPath: '/en/about/test-rast/',
        }}
      />
    </div>
  );
}
