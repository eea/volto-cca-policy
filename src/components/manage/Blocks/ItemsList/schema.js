import React from 'react';
import NumberWidget from '@plone/volto/components/manage/Widgets/NumberWidget';

const ColumnsWidget = (props) =>
  props.objectvalue?.listing_mode === 'columns'
    ? React.createElement(NumberWidget, props)
    : null;

const Item = () => ({
  title: 'Item',
  fieldsets: [
    {
      id: 'default',
      title: 'Item',
      fields: [
        'title',
        'description',
        'href',
        'icon',
        'custom_icon',
        'hover_icon',
        'custom_hover_icon',
        'hover_color',
      ],
    },
  ],
  properties: {
    title: { title: 'Title', type: 'string' },
    description: { title: 'Description', type: 'text' },
    href: {
      widget: 'object_browser',
      mode: 'link',
      title: 'HREF',
      description: 'Choose an existing content as source',
    },
    icon: {
      title: 'Remix Icon',
      type: 'string',
      choices: [
        '',
        'ri-home-line',
        'ri-leaf-line',
        'ri-sun-line',
        'ri-cloud-line',
        'ri-water-flash-line',
        'ri-map-pin-line',
        'ri-book-open-line',
        'ri-arrow-right-line',
        'ri-external-link-line',
        'ri-search-line',
        'ri-settings-3-line',
      ].map((name) => [name, name || 'None']),
    },
    custom_icon: {
      widget: 'object_browser',
      mode: 'image',
      title: 'Custom icon',
      description: 'Choose an image to use as this item’s icon',
    },
    hover_icon: {
      title: 'Remix Icon on hover',
      type: 'string',
      choices: [
        '',
        'ri-home-fill',
        'ri-leaf-fill',
        'ri-sun-fill',
        'ri-cloud-fill',
        'ri-water-flash-fill',
        'ri-map-pin-fill',
        'ri-book-open-fill',
        'ri-arrow-right-fill',
        'ri-external-link-fill',
        'ri-search-fill',
        'ri-settings-3-fill',
      ].map((name) => [name, name || 'None']),
    },
    custom_hover_icon: {
      widget: 'object_browser',
      mode: 'image',
      title: 'Custom hover icon',
      description: 'Choose an image to use as this item’s hover icon',
    },
    hover_color: {
      title: 'Remix Icon hover color',
      type: 'string',
      widget: 'color',
    },
  },
});

const schema = {
  title: 'Items List',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'listing_mode',
        'columns',
        'title',
        'description_top',
        'icon_size',
        'items',
        'description_bottom',
      ],
    },
  ],
  properties: {
    listing_mode: {
      title: 'Display items as',
      type: 'string',
      default: 'inline',
      choices: [
        ['inline', 'Inline items'],
        ['columns', 'Columns with titles and descriptions'],
      ],
    },
    columns: {
      widget: ColumnsWidget,
      title: 'Number of columns',
      type: 'integer',
      default: 2,
      minimum: 1,
      maximum: 6,
    },
    title: { title: 'Title', type: 'string' },
    description_top: { title: 'Top description', type: 'text' },
    description_bottom: { title: 'Bottom description', type: 'text' },
    icon_size: {
      title: 'Icon height (px)',
      type: 'integer',
      default: 48,
      minimum: 1,
    },
    items: { widget: 'object_list', title: 'Items', schema: Item() },
  },
  required: [],
};

export default schema;
