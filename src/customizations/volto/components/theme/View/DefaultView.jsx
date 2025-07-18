/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import {
  Container as SemanticContainer,
  Segment,
  Grid,
  Label,
} from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { getSchema } from '@plone/volto/actions';
import { getWidget } from '@plone/volto/helpers/Widget/utils';

import { hasBlocksData, getBaseUrl } from '@plone/volto/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { RenderBlocks } from '@plone/volto/components';
import ContextNavigation from '@plone/volto/components/theme/Navigation/ContextNavigation';
import {
  BannerTitle,
  ASTNavigation,
  PortalMessage,
} from '@eeacms/volto-cca-policy/components';

import { isEqual } from 'lodash';

/**
 * Component to display the default view.
 * @function DefaultView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
const DefaultView = (props) => {
  const dispatch = useDispatch();
  const { widgets, settings } = config;
  const { views } = widgets;
  const { content, location } = props;
  const { astNavigations, contextNavigationLocations } = settings;
  const path = getBaseUrl(location?.pathname || '');
  const contentSchema = useSelector((state) => state.schema?.schema);
  const fieldsetsToExclude = [
    'categorization',
    'dates',
    'ownership',
    'settings',
  ];
  const fieldsets = contentSchema?.fieldsets.filter(
    (fs) => !fieldsetsToExclude.includes(fs.id),
  );

  // TL;DR: There is a flash of the non block-based view because of the reset
  // of the content on route change. Subscribing to the content change at this
  // level has nasty implications, so we can't watch the Redux state for loaded
  // content flag here (because it forces an additional component update)
  // Instead, we can watch if the content is "empty", but this has a drawback
  // since the locking mechanism inserts a `lock` key before the content is there.
  // So "empty" means `content` is present, but only with a `lock` key, thus the next
  // ugly condition comes to life
  const contentLoaded = content && !isEqual(Object.keys(content), ['lock']);

  React.useEffect(() => {
    content?.['@type'] &&
      !hasBlocksData(content) &&
      dispatch(getSchema(content['@type'], location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Container =
    config.getComponent({ name: 'Container' }).component || SemanticContainer;

  let currentNavigation = contextNavigationLocations.find(
    (element) => location.pathname.indexOf(element.rootPath) > -1,
  );
  const astNavigation = astNavigations.find(
    (nav) => location.pathname.indexOf(nav.root_path) > -1,
  );

  const gridColumns =
    currentNavigation && currentNavigation?.columns
      ? currentNavigation.columns
      : 3;
  const currentLang = useSelector((state) => state.intl.locale);

  const isChromeless = location.search?.indexOf('chromeless=1') > -1;

  return contentLoaded ? (
    hasBlocksData(content) ? (
      <>
        {currentNavigation ? (
          <Container id="page-document">
            <PortalMessage content={content} />
            <Grid>
              <Grid.Column width={12 - gridColumns}>
                <BannerTitle {...props} />
                <RenderBlocks {...props} path={path} />
              </Grid.Column>
              <Grid.Column width={gridColumns}>
                <ContextNavigation
                  params={{
                    name: currentNavigation.title,
                    includeTop: false,
                    // currentFolderOnly: true,
                    topLevel: currentNavigation.topLevel + 1,
                    bottomLevel: currentNavigation.bottomLevel + 1,
                    rootPath: `${currentLang}/${currentNavigation.rootPath}`,
                  }}
                />
              </Grid.Column>
            </Grid>
          </Container>
        ) : astNavigation ? (
          <Container id="page-document">
            <PortalMessage content={content} />
            <Grid>
              <Grid.Column mobile={12} tablet={12} computer={4}>
                <ASTNavigation astNavigation={astNavigation} />
              </Grid.Column>
              <Grid.Column mobile={12} tablet={12} computer={8}>
                <BannerTitle {...props} />
                <RenderBlocks {...props} path={path} />
              </Grid.Column>
            </Grid>
          </Container>
        ) : (
          <Container id="page-document">
            <PortalMessage content={content} />
            {!isChromeless && <BannerTitle {...props} />}
            <RenderBlocks {...props} path={path} />
          </Container>
        )}
      </>
    ) : (
      <Container id="page-document">
        {fieldsets?.map((fs) => {
          return (
            <div className="fieldset" key={fs.id}>
              {fs.id !== 'default' && <h2>{fs.title}</h2>}
              {fs.fields?.map((f, key) => {
                let field = {
                  ...contentSchema?.properties[f],
                  id: f,
                  widget: getWidget(f, contentSchema?.properties[f]),
                };
                let Widget = views?.getWidget(field);
                return f !== 'title' ? (
                  <Grid celled="internally" key={key}>
                    <Grid.Row>
                      <Label>{field.title}:</Label>
                    </Grid.Row>
                    <Grid.Row>
                      <Segment basic>
                        <Widget value={content[f]} />
                      </Segment>
                    </Grid.Row>
                  </Grid>
                ) : (
                  <Widget key={key} value={content[f]} />
                );
              })}
            </div>
          );
        })}
      </Container>
    )
  ) : null;
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
DefaultView.propTypes = {
  /**
   * Content of the object
   */
  content: PropTypes.shape({
    /**
     * Title of the object
     */
    title: PropTypes.string,
    /**
     * Description of the object
     */
    description: PropTypes.string,
    /**
     * Text of the object
     */
    text: PropTypes.shape({
      /**
       * Data of the text of the object
       */
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(DefaultView);
