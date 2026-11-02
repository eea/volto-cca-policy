jest.doMock('./Edit', () => ({ __esModule: true, default: () => null }));
jest.doMock('./View', () => ({ __esModule: true, default: () => null }));

const installItemsList = require('./index').default;
const Edit = require('./Edit').default;
const View = require('./View').default;

it('registers the Items List block with its edit and view components', () => {
  const config = { blocks: { blocksConfig: {} } };

  expect(installItemsList(config)).toBe(config);
  expect(config.blocks.blocksConfig.itemsList).toMatchObject({
    id: 'itemsList',
    title: 'Items List',
    edit: Edit,
    view: View,
    sidebarTab: 1,
  });
  expect(config.blocks.blocksConfig.itemsList.restricted({})).toBe(false);
});
