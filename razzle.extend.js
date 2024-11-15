const path = require('path');

const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const babelLoaderFinder = makeLoaderFinder('babel-loader');

const plugins = (defaultPlugins) => {
  return defaultPlugins;
};
const modify = (config, { target, dev }, webpack) => {
  const themeConfigPath = `${__dirname}/theme/theme.config`;
  config.resolve.alias['../../theme.config$'] = themeConfigPath;
  config.resolve.alias['../../theme.config'] = themeConfigPath;
  config.resolve.alias['../../theme'] = `${__dirname}/theme`;
  const projectRootPath = path.resolve('.');
  const themeLessPath = `${projectRootPath}/node_modules/@eeacms/volto-eea-design-system/theme`;

  config.resolve.alias['eea-design-system-theme'] = dev
    ? `${projectRootPath}/src/addons/volto-eea-design-system/theme/themes/eea`
    : `${themeLessPath}/themes/eea`;

  const semanticLessPath = `${projectRootPath}/node_modules/semantic-ui-less`;
  const hasDesignSystemInstalled = config.resolve.alias['eea-volto-themes'];
  config.resolve.alias['eea-volto-theme-folder'] = hasDesignSystemInstalled
    ? themeLessPath
    : semanticLessPath;

  const babelLoader = config.module.rules.find(babelLoaderFinder);
  const sanitizePath = path.join(
    path.dirname(require.resolve('sanitize-html')),
  );
  const { include } = babelLoader;
  const htmlParserPath = `${sanitizePath}/node_modules/htmlparser2/lib/esm/`;

  include.push(sanitizePath);
  include.push(htmlParserPath);

  return config;
};

module.exports = {
  plugins,
  modify,
};
