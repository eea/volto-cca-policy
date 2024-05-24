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

export const hasTypeOfBlock = (obj, type, name) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === type && obj[key] === name) {
        // console.log(`Key "${type}" with value "${name}" found`);
        return true;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (hasTypeOfBlock(obj[key], type, name)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const filterBlocks = (content, block_type) => {
  const filteredBlocks = { ...content.blocks };
  const filteredBlocksLayout = { ...content.blocks_layout };

  const filteredBlockUID = Object.keys(filteredBlocks)?.filter(
    (key) => filteredBlocks[key]['@type'] === block_type,
  );
  filteredBlockUID.forEach((key) => delete filteredBlocks[key]);
  filteredBlocksLayout.items = filteredBlocksLayout?.items?.filter(
    (item) => !filteredBlockUID.includes(item),
  );
  const hasBlockType = filteredBlockUID.length > 0;

  return {
    blocks: filteredBlocks,
    blocks_layout: filteredBlocksLayout,
    hasBlockType,
  };
};
