import TableBlockEdit from '@plone/volto-slate/blocks/Table/TableBlockEdit';
import TableBlockView from '@plone/volto-slate/blocks/Table/TableBlockView';
import { extractTables } from './deconstruct';
import { normalizeTable } from '@plone/volto-slate/blocks/Table/extensions/normalizeTable';
import { normalizeExternalData } from '@plone/volto-slate/blocks/Text/extensions';

import tableSVG from '@plone/volto/icons/table.svg';

/**
 * @summary Called from Volto to configure new or existing Volto block types.
 * @param {object} config The object received from Volto containing the
 * configuration for all the blocks.
 */
export default function install(config) {
  config.settings.slate = {
    ...config.settings.slate,
    tableblockExtensions: [
      // First here gets executed last
      // withLists,
      // withSplitBlocksOnBreak,
      // withDeleteSelectionOnEnter,
      // withDeserializers,
      // breakList,
      normalizeTable,
      normalizeExternalData,
    ],
  };

  const tableBlockConfig = {
    id: 'table',
    title: 'Table',
    icon: tableSVG,
    group: 'common',
    view: TableBlockView,
    edit: TableBlockEdit,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    // blockHasValue: (data) => {
    //   return true;
    // },
  };

  config.blocks.blocksConfig.table.restricted = true;
  config.blocks.blocksConfig.slateTable = {
    ...tableBlockConfig,
    id: 'slateTable',
  };

  const { voltoBlockEmiters = [] } = config.settings.slate;
  const imageExtractor = voltoBlockEmiters.find(
    (e) => e.id === 'extractImages',
  );

  // we want to extract the tables before the images, so that the images that
  // that are inserted in the tables are not extracted as Volto image blocks
  config.settings.slate.voltoBlockEmiters = [
    ...voltoBlockEmiters.filter((e) => e.id !== 'extractImages'),
    extractTables,
    ...(imageExtractor ? [imageExtractor] : []),
  ];

  return config;
}
