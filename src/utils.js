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

  let formattedText = text
    .replace(/\\\\/g, '\\') // unescape backslashes
    .replace(/\\'/g, "'") // unescape single quotes
    .replace(/\\"/g, '"') // unescape double quotes
    .replace(/\\t\\n/g, '') // handle \t\n
    .replace(/\\n\\n/g, '</p><p>') // double line break = paragraph
    .replace(/\\no\s*/g, '<br />• ') // list-like "o " to bullet point
    .replace(/\\n/g, '<br />'); // single line break

  // Convert URLs to clickable links
  formattedText = formattedText.replace(
    /(?<!["'>])((https?:\/\/[^\s<>"]+))/g,
    '<a href="$1" target="_blank" rel="noreferrer">$1</a>',
  );

  return formattedText.includes('<p>') || formattedText.includes('<a>')
    ? formattedText
    : `<p>${formattedText}</p>`;
};

const trimTrailingChars = (str) => {
  const charsToTrim = ['-', '–', ';', ',', ':', ' '];
  let end = str.length;
  while (end > 0 && charsToTrim.includes(str[end - 1])) {
    end--;
  }
  return str.substring(0, end);
};

export const extractPlanNameAndURL = (text) => {
  if (!text) return { name: '', url: '' };

  // Match all URLs
  const urls = text.match(/https?:\/\/[^\s,;)]+/g) || [];

  let name = text;
  let url = '';

  if (urls.length > 1) {
    // Edge case like Rotterdam: use second URL as the actual link
    name = text.split(urls[0])[0] || urls[0]; // name is before or equals first URL
    url = urls[1];
  } else {
    const parenthesisMatch = text.match(/\((https?:\/\/[^\s)]+)\)/);
    const directMatch = text.match(/https?:\/\/[^\s,;)]+/);
    url = parenthesisMatch?.[1] || directMatch?.[0] || '';

    if (url) {
      name = text.replace(`(${url})`, '').replace(url, '');
    }
  }

  name = trimTrailingChars(name).trim();

  return { name, url };
};

export const isEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;

export const normalizeImageFileName = (filename) => {
  if (!filename) return '';

  const parts = filename.split('.');
  if (parts.length < 2)
    return filename.split('(').join('-').split(')').join('-');

  const ext = parts.pop();
  let name = parts.join('.');

  name = name.split('(').join('-').split(')').join('-');

  if (name.endsWith('-')) {
    name = name.slice(0, -1);
  }

  return `${name}.${ext}`;
};
