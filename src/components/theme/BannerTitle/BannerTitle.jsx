import config from '@plone/volto/registry';

const BannerTitle = (props) => {
  const { content } = props;
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;
  const hasTitleBlock = content?.blocks
    ? Object.keys(content?.blocks).find(
        (id) => content?.blocks?.[id]?.['@type'] === 'title',
      )
    : null;
  const isHomePage =
    ['Subsite', 'LRF', 'Plone Site'].indexOf(content?.['@type']) > -1;

  return !isHomePage ? (
    <>
      {!hasTitleBlock ? (
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
