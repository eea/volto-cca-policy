jest.doMock('@plone/volto/components/manage/Widgets/NumberWidget', () => ({
  __esModule: true,
  default: () => null,
}));

const NumberWidget =
  require('@plone/volto/components/manage/Widgets/NumberWidget').default;
const schema = require('./schema').default;

describe('ItemsList schema', () => {
  const itemSchema = schema.properties.items.schema;

  it('configures both custom icon selectors as image object browsers', () => {
    expect(itemSchema.properties.custom_icon).toMatchObject({
      widget: 'object_browser',
      mode: 'image',
    });
    expect(itemSchema.properties.custom_hover_icon).toMatchObject({
      widget: 'object_browser',
      mode: 'image',
    });
    expect(itemSchema.fieldsets[0].fields).toContain('custom_icon');
    expect(itemSchema.fieldsets[0].fields).toContain('custom_hover_icon');
    expect(itemSchema.properties).not.toHaveProperty('custom_icon_path');
    expect(itemSchema.properties).not.toHaveProperty('custom_hover_icon_path');
  });

  it('shows the number of columns only for the columns layout', () => {
    const { widget: ColumnsWidget } = schema.properties.columns;

    expect(
      ColumnsWidget({ objectvalue: { listing_mode: 'inline' } }),
    ).toBeNull();
    const columnsWidget = ColumnsWidget({
      objectvalue: { listing_mode: 'columns' },
    });
    expect(columnsWidget.type).toBe(NumberWidget);
  });
});
