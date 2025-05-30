import listSVG from '@plone/volto/icons/list-bullet.svg';
import ContentLinksEdit from './ContentLinksEdit';
import ContentLinksView from './ContentLinksView';
import DropdownListView from './DropdownListView';

export default function installBlock(config) {
  config.blocks.blocksConfig.contentLinks = {
    id: 'contentLinks',
    title: 'Content Links',
    icon: listSVG,
    group: 'site',
    view: ContentLinksView,
    edit: ContentLinksEdit,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [
      {
        id: 'default',
        title: 'Simple list (default)',
        isDefault: true,
      },
      {
        id: 'navigationList',
        title: 'Navigation list',
        isDefault: false,
        fullobjects: true,
      },
      {
        id: 'dropdown',
        title: 'Dropdown',
        view: DropdownListView,
        isDefault: false,
        schemaEnhancer: ({ schema }) => {
          schema.properties.placeholder_text = {
            title: 'Placeholder text',
          };
          schema.fieldsets[0].fields.push('placeholder_text');
          return schema;
        },
      },
    ],
    restricted: false,
  };

  return config;
}
