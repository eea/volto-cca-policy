import config from '@plone/volto/registry';

const hasTypeOfBlock = (type, blocks) => {
  const block = blocks
    ? Object.keys(blocks).find((id) => blocks?.[id]?.['@type'] === type)
    : null;

  return block;
};

const BannerTitle = (props) => {
  const { content } = props;
  const { blocks } = content;
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;
  const hasTitleBlock = hasTypeOfBlock('title', blocks);
  const hasCountryFlagBlock = hasTypeOfBlock('countryFlag', blocks);
  const types = ['Subsite', 'LRF', 'Plone Site'];
  const isHomePage = types.indexOf(content?.['@type']) > -1;

  return !isHomePage ? (
    <>
      {!hasTitleBlock && !hasCountryFlagBlock ? (
        <TitleBlockView
          {...props}
          data={{
            info: [{ description: '' }],
            hideContentType: true,
            hideCreationDate: true,
            hideModificationDate: true,
            hidePublishingDate: true,
            hideDownloadButton: false,
            hideShareButton: false,
          }}
          metadata={content}
        />
      ) : null}
    </>
  ) : null;
};

export default BannerTitle;
