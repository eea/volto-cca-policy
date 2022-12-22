const applyConfig = (config) => {
  config.settings.dateLocale = 'en-gb';
  config.settings.isMultilingual = true;
  config.settings.defaultLanguage =
    config.settings.eea?.defaultLanguage || 'en';
  // config.settings.supportedLanguages = config.settings.eea?.languages?.map(
  //   (item) => item.code,
  // ) || ['en'];
  config.settings.supportedLanguages = ['en', 'de', 'fr', 'es', 'it'];

  return config;
};

export default applyConfig;
