export const blockAvailableInMission = (properties, block) => {
  const missionBlocks = ['mkh_map', 'rastBlock'];
  const isMission = properties['@id'].includes('/en/mission');

  if (isMission) {
    return missionBlocks.includes(block.id) ? false : true;
  } else {
    return false;
  }
};
