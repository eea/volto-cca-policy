import React from 'react';
import config from '@plone/volto/registry';
import { hasTypeOfBlock } from '@eeacms/volto-cca-policy/utils';

const BannerTitle = (props) => {
  const { content } = props;
  const { blocks } = content;
  const type = content['@type'];
  const {
    blocks: { blocksConfig },
  } = config;
  const contentTypes = ['Subsite', 'LRF', 'Plone Site'];
  const TitleBlockView = blocksConfig?.title?.view;
  const hasTitleBlock = hasTypeOfBlock(blocks, 'title');
  const hasCountryFlagBlock = hasTypeOfBlock(blocks, 'countryFlag');
  const [hasBodyClass, setHasBodyClass] = React.useState(false);
  const isHomePage = contentTypes.indexOf(type) > -1 || hasBodyClass;

  React.useEffect(() => {
    const bodyClasses = document.body.className;
    const hasHomePageClass = bodyClasses.includes('homepage');
    setHasBodyClass(hasHomePageClass);
  }, []);

  return isHomePage ? null : (
    <>
      {!hasTitleBlock && !hasCountryFlagBlock ? (
        <>
          <TitleBlockView
            {...props}
            data={{
              '@type': 'title',
              info: [{ description: '' }],
              hideContentType: false,
              hideCreationDate: false,
              hideModificationDate: false,
              hidePublishingDate: false,
              hideDownloadButton: false,
              hideShareButton: false,
            }}
            metadata={content}
            properties={content}
          />
        </>
      ) : null}
    </>
  );
};

export default BannerTitle;
