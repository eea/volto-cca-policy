import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchContent } from '@plone/volto/actions';
import { useLocation } from 'react-router-dom';
import ASTAccordion from './ASTAccordion';
import {
  isAdaptationSupportToolURL,
  isUrbanAdaptationSupportToolURL,
} from './utils';
import './styles.less';

const ASTNavigation = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const { root_path } = props.astNavigation;
  const currentLanguage = useSelector((state) => state.intl.locale);
  const rootPath = `/${currentLanguage}/${root_path}`;
  const searchSubrequests = useSelector((state) => state.search.subrequests);
  const items = searchSubrequests?.ast?.items || [];
  const isAdaptationSupportTool = isAdaptationSupportToolURL(rootPath);
  const isUrbanAdaptationSupportTool = isUrbanAdaptationSupportToolURL(
    rootPath,
  );

  React.useEffect(() => {
    if (isAdaptationSupportTool) {
      dispatch(
        searchContent(
          rootPath,
          {
            'path.depth': 1,
            portal_type: ['collective.cover.content'],
            review_state: 'published',
            b_size: 100,
          },
          'ast',
        ),
      );
    }
    if (isUrbanAdaptationSupportTool) {
      dispatch(
        searchContent(
          rootPath,
          {
            'path.depth': 1,
            portal_type: ['Folder'],
            review_state: 'published',
            b_size: 100,
          },
          'ast',
        ),
      );
    }
  }, [
    rootPath,
    dispatch,
    isAdaptationSupportTool,
    isUrbanAdaptationSupportTool,
  ]);

  for (let i = 0; i < items.length; i++) {
    items[i].is_active = false;
    if (pathname.includes(items[i]['@id'])) {
      items[i].is_active = true;
    }
  }

  return items && items.length > 0 ? (
    <div className="ast-navigation">
      <ASTAccordion
        astItems={items}
        rootPath={rootPath}
        location={location}
        currentLanguage={currentLanguage}
        isAdaptationSupportTool={isAdaptationSupportTool}
        isUrbanAdaptationSupportTool={isUrbanAdaptationSupportTool}
      />
    </div>
  ) : null;
};

export default ASTNavigation;
