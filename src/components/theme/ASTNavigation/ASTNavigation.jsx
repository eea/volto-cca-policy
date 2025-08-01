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
  const { root_path } = props.astNavigation;
  const currentLanguage = useSelector((state) => state.intl.locale);
  const rootPath = `/${currentLanguage}/${root_path}`;
  const searchSubrequests = useSelector((state) => state.search.subrequests);
  const items = searchSubrequests?.ast?.items || [];
  const isAdaptationSupportTool = isAdaptationSupportToolURL(rootPath);
  const isUrbanAdaptationSupportTool =
    isUrbanAdaptationSupportToolURL(rootPath);

  React.useEffect(() => {
    if (isAdaptationSupportTool) {
      dispatch(
        searchContent(
          rootPath,
          {
            'path.depth': 1,
            portal_type: ['Folder'],
            object_provides: 'eea.climateadapt.interfaces.ICover',
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
