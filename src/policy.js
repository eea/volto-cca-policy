import installCallout from '@plone/volto-slate/editor/plugins/Callout';

// import { runtimeConfig } from '@plone/volto/runtime_config';
// import installContextNavigationBlock from './components/manage/Blocks/ContextNavigation';
// import installLayoutSettingsBlock from './components/manage/Blocks/LayoutSettings';

const applyConfig = (config) => {
  // if (process.env.NODE_ENV === 'production') {
  //   // Restrict block-style to Layout only
  //   config.settings.layoutOnlyBlockStyles = true;
  //   // Restrict slate metadata mentions to Layout only
  //   config.settings.layoutOnlySlateMetadataMentions = true;
  // }
  // Callout slate button
  config = installCallout(config);

  // Remove blockquote slate button
  config.settings.slate.toolbarButtons = config.settings.slate.toolbarButtons.filter(
    (item) => item !== 'blockquote',
  );

  // Disable tags on View
  config.settings.showTags = false;

  // Enable Title block
  config.blocks.blocksConfig.title.restricted = false;

  // Enable description block (also for cypress)
  config.blocks.blocksConfig.description.restricted = false;
  config.blocks.requiredBlocks = [];

  // Date format for EU
  config.settings.dateLocale = 'en-gb';

  // #137187 Keycloak integration
  // if (runtimeConfig['RAZZLE_KEYCLOAK'] === 'Yes') {
  //   config.settings.externalRoutes = [
  //     ...(config.settings.externalRoutes || []),
  //     {
  //       match: {
  //         path: '/en/mission/login',
  //         exact: true,
  //         strict: false,
  //       },
  //     },
  //     {
  //       match: {
  //         path: '/logout',
  //         exact: true,
  //         strict: false,
  //       },
  //     },
  //   ];
  // }

  // Working-copy
  config.settings.hasWorkingCopySupport = true;

  // Multi-lingual
  config.settings.isMultilingual = true;
  config.settings.defaultLanguage =
    config.settings.eea?.defaultLanguage || 'en';
  // config.settings.supportedLanguages = config.settings.eea?.languages?.map(
  //   (item) => item.code,
  // ) || ['en'];
  config.settings.supportedLanguages = ['en', 'de', 'fr', 'es', 'it'];

  // Block chooser
  config.blocks.blocksConfig.image.mostUsed = false;
  config.blocks.blocksConfig.video.mostUsed = false;

  // Grid/Teaser block (kitconcept)
  if (config.blocks.blocksConfig.__grid) {
    config.blocks.blocksConfig.__grid.restricted = true;
  }
  if (config.blocks.blocksConfig.imagesGrid) {
    config.blocks.blocksConfig.imagesGrid.restricted = true;
  }
  if (config.blocks.blocksConfig.teaser) {
    config.blocks.blocksConfig.teaser.restricted = true;
  }

  // Divider
  if (config.blocks.blocksConfig.dividerBlock) {
    config.blocks.blocksConfig.dividerBlock.mostUsed = true;
  }

  // Enable volto-embed
  if (config.blocks.blocksConfig.maps) {
    config.blocks.blocksConfig.maps.restricted = false;
  }

  // Call to Action
  if (config.blocks.blocksConfig.callToActionBlock) {
    config.blocks.blocksConfig.callToActionBlock.mostUsed = true;
  }

  // Columns
  if (config.blocks.blocksConfig.columnsBlock) {
    config.blocks.blocksConfig.columnsBlock.mostUsed = true;
  }

  // Accordion
  if (config.blocks.blocksConfig.accordion) {
    config.blocks.blocksConfig.accordion.mostUsed = true;
  }

  // Listing
  if (config.blocks.blocksConfig.listing) {
    config.blocks.blocksConfig.listing.title = 'Listing (Content)';
  }

  // Custom blocks
  // context navigation
  // config = [installContextNavigationBlock].reduce(
  //   (acc, apply) => apply(acc),
  //   config,
  // );

  // // layout settings
  // config = [installLayoutSettingsBlock].reduce(
  //   (acc, apply) => apply(acc),
  //   config,
  // );

  // Disable some blocks
  if (config.blocks.blocksConfig.imagecards) {
    config.blocks.blocksConfig.imagecards.restricted = true;
  }

  console.log(config);

  // Done
  return config;
};

export default applyConfig;
