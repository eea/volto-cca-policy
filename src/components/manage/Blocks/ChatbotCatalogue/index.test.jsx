import applyConfig from './index';

jest.mock('./CatalogueChatView', () => () => <div />);

const makeConfig = (variations) => ({
  blocks: {
    blocksConfig: {
      eeaChatbot: variations ? { variations } : {},
    },
  },
});

describe('ChatbotCatalogue applyConfig', () => {
  it('registers the catalogue variation on the eeaChatbot block', () => {
    const config = applyConfig(makeConfig());
    const variations = config.blocks.blocksConfig.eeaChatbot.variations;
    expect(variations).toHaveLength(1);
    expect(variations[0]).toMatchObject({
      id: 'catalogue',
      title: 'Catalogue (CCA)',
      isDefault: false,
    });
    expect(typeof variations[0].view).toBe('function');
  });

  it('does not register a duplicate when called twice', () => {
    let config = applyConfig(makeConfig());
    config = applyConfig(config);
    const variations = config.blocks.blocksConfig.eeaChatbot.variations;
    expect(variations.filter((v) => v.id === 'catalogue')).toHaveLength(1);
  });

  it('keeps existing variations and their order', () => {
    const classic = { id: 'classic', isDefault: true, view: () => <div /> };
    const config = applyConfig(makeConfig([classic]));
    const variations = config.blocks.blocksConfig.eeaChatbot.variations;
    expect(variations.map((v) => v.id)).toEqual(['classic', 'catalogue']);
  });

  it('is a no-op when the eeaChatbot block is not registered', () => {
    const config = { blocks: { blocksConfig: {} } };
    expect(applyConfig(config)).toEqual(config);
  });

  it('loosens the restricted check to allow Manager, Site Administrator, and Editor', () => {
    const config = applyConfig(makeConfig());
    const isRestricted = config.blocks.blocksConfig.eeaChatbot.restricted;

    expect(isRestricted({ user: { roles: ['Manager'] } })).toBe(false);
    expect(isRestricted({ user: { roles: ['Site Administrator'] } })).toBe(
      false,
    );
    expect(isRestricted({ user: { roles: ['Editor'] } })).toBe(false);
    expect(isRestricted({ user: { roles: ['Contributor'] } })).toBe(true);
    expect(isRestricted({ user: { roles: ['Reader'] } })).toBe(true);
    expect(isRestricted({ user: null })).toBe(false);
  });

  it('also updates danswerChat restricted if present', () => {
    const baseConfig = {
      blocks: {
        blocksConfig: {
          eeaChatbot: {},
          danswerChat: {},
        },
      },
    };
    const config = applyConfig(baseConfig);
    const isRestricted = config.blocks.blocksConfig.danswerChat.restricted;
    expect(isRestricted({ user: { roles: ['Editor'] } })).toBe(false);
    expect(isRestricted({ user: { roles: ['Contributor'] } })).toBe(true);
  });
});
