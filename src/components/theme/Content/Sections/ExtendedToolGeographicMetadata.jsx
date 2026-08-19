import { Fragment } from 'react';
import MetadataItemList from './MetadataItemList';
import { renderGeochar } from './geographicMetadataUtils';

const sectionOrder = [0, 3, 1, 2, 4, 5];

const getSections = (content) => {
  const { geochars, spatial_layer, spatial_values } = content;

  if (!geochars) {
    return [spatial_layer ? [spatial_layer] : [], spatial_values || []];
  }

  let parsedGeochars;
  try {
    parsedGeochars = JSON.parse(geochars);
  } catch {
    return [];
  }

  const renderedSections = renderGeochar(parsedGeochars?.geoElements) || [];

  return sectionOrder.map((index) => renderedSections[index]?.value || []);
};

const ExtendedToolGeographicMetadata = ({ content = {} }) => {
  const sections = getSections(content).filter((values) => values?.length);

  if (!sections.length) return null;

  return (
    <div className="extended-tool-geographic-metadata">
      {sections.map((values, index) => (
        <Fragment
          key={values
            .map((item) => item?.token || item?.title || item)
            .join('-')}
        >
          <MetadataItemList asInline value={values} />
          {index < sections.length - 1 && ' · '}
        </Fragment>
      ))}
    </div>
  );
};

export default ExtendedToolGeographicMetadata;
