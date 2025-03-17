import MissionSignatoriesProfileEdit from './MissionSignatoriesProfileEdit';
import MissionSignatoriesProfileView from './MissionSignatoriesProfileView';
import { blockAvailableInMission } from '@eeacms/volto-cca-policy/utils';
import worldSVG from '@plone/volto/icons/world.svg';

export default function installMissionSignatoriesProfileBlock(config) {
  config.blocks.blocksConfig.missionSignatoriesProfile = {
    id: 'missionSignatoriesProfile',
    title: 'Mission Signatories Profile',
    icon: worldSVG,
    group: 'site',
    edit: MissionSignatoriesProfileEdit,
    view: MissionSignatoriesProfileView,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    restricted: ({ properties, block }) => {
      return blockAvailableInMission(properties, block);
    },
  };

  return config;
}
