export const observatoryURL = (item) => {
  return item['@id'].replace('/metadata/', '/observatory/++aq++metadata/');
};
