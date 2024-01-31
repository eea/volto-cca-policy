export const euCountryNames = [
  'Albania',
  'Austria',
  'Belgium',
  'Bosnia-Herzegovina',
  'Bosnia and Herzegovina',
  'Bulgaria',
  'Cyprus',
  'Croatia',
  'Czechia',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Montenegro',
  'Netherlands',
  'North Macedonia',
  'Poland',
  'Portugal',
  'Romania',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'United Kingdom',
  'Liechtenstein',
  'Norway',
  'Switzerland',
  'Turkey',
];

export function getFocusCountryNames() {
  return euCountryNames;
}

export const getFocusCountriesFeature = (world) => {
  const focusCountryNames = getFocusCountryNames();
  let features = {
    type: 'FeatureCollection',
    features: [],
  };
  world.features.forEach(function (c) {
    if (focusCountryNames.indexOf(c.properties.SHRT_ENGL) === -1) {
      return;
    }
    features.features.push(c);
  });
  return features;
};
