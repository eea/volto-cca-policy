import config from '@plone/volto/registry';

const ContentBannerTitle = (props) => {
  const { content, data } = props;
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;

  const blockData = {
    '@type': 'title',
    ...data,
  };

  return (
    <TitleBlockView
      {...props}
      data={blockData}
      metadata={content}
      properties={content}
      blocksConfig={blocksConfig}
    />
  );
};

export default ContentBannerTitle;
