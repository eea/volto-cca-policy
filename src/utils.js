import { flattenToAppURL } from '@plone/volto/helpers';

export const blockAvailableInMission = (properties, block) => {
  const missionBlocks = ['mkh_map', 'rastBlock', 'missionSignatoriesProfile'];
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

export const hasTypeOfBlock = (obj, name) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === '@type' && obj[key] === name) {
        // console.log(`Key "${type}" with value "${name}" found`);
        return true;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (hasTypeOfBlock(obj[key], name)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const filterBlocks = (content, blockTypes = []) => {
  const allBlocks = content.blocks || {};
  const allBlockKeys = Object.keys(allBlocks);

  const filteredBlocks = { ...allBlocks };
  const filteredLayoutItems = [...(content.blocks_layout?.items || [])];

  const excludedBlockKeys = allBlockKeys.filter((key) =>
    blockTypes.includes(allBlocks[key]['@type']),
  );

  excludedBlockKeys.forEach((key) => {
    delete filteredBlocks[key];
  });

  return {
    blocks: filteredBlocks,
    blocks_layout: {
      ...content.blocks_layout,
      items: filteredLayoutItems.filter(
        (item) => !excludedBlockKeys.includes(item),
      ),
    },
    hasBlockTypes: excludedBlockKeys.length > 0,
  };
};

export const formatTextToHTML = (text) => {
  if (!text) return '';

  let formattedText = text;

  // Handle common escape issues
  formattedText = formattedText.replace(/\\\\/g, '\\'); // unescape backslashes
  formattedText = formattedText.replace(/\\'/g, "'"); // unescape single quotes
  formattedText = formattedText.replace(/\\"/g, '"'); // unescape double quotes

  // Replace \\n\\n with </p><p> for paragraph separation
  formattedText = formattedText.replace(/\\n\\n/g, '</p><p>');

  // Replace \\n with <br /> for line breaks
  formattedText = formattedText.replace(/\\n/g, '<br />');

  return `<p>${formattedText}</p>`;
};
