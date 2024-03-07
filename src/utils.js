import { flattenToAppURL } from '@plone/volto/helpers';

export const blockAvailableInMission = (properties, block) => {
  const missionBlocks = ['mkh_map', 'rastBlock'];
  const id = properties?.['@id'];

  if (!id) {
    return false;
  }

  const isMission = id.includes('/en/mission');

  if (isMission) {
    return missionBlocks.includes(block.id) ? false : true;
  } else {
    return missionBlocks.includes(block.id) ? true : false;
  }
};

// if a block has a 'href' data with a link widget, it returns the href of that
// based on block props
export function getBaseUrl(props) {
  let path =
    props.data?.href?.[0]?.['@id'] ||
    props.path ||
    props.location?.pathname ||
    '';

  if (path) {
    path = flattenToAppURL(path);
  }
  return path;
}
