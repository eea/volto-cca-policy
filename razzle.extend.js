const path = require('path');
const plugins = (defaultPlugins) => {
  return defaultPlugins;
};
const modify = (config, { target, dev }, webpack) => {
  const themeConfigPath = `${__dirname}/theme/theme.config`;
  config.resolve.alias['../../theme.config$'] = themeConfigPath;
  config.resolve.alias['../../theme.config'] = themeConfigPath;

  const design = '@eeacms/volto-eea-design-system';

  const eeaDesignSystem =
    config.resolve.alias[design] || require.resolve(design);

  const projectRootPath = path.resolve('.');
  const themeLessPath = path.join(eeaDesignSystem, '../theme');

  config.resolve.alias[
    'eea-design-system-theme'
  ] = `${themeLessPath}/themes/eea`;

  const semanticLessPath = `${projectRootPath}/node_modules/semantic-ui-less`;
  const hasDesignSystemInstalled = config.resolve.alias['eea-volto-themes'];
  config.resolve.alias['eea-volto-theme-folder'] = hasDesignSystemInstalled
    ? themeLessPath
    : semanticLessPath;

  console.log(config.resolve.alias);
  return config;
};

module.exports = {
  plugins,
  modify,
};
