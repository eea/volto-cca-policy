function GeoChar(props) {
  const { value } = props;
  const j = JSON.parse(value);

  const { geoElements } = j;
  const elements = [];

  if (geoElements.element === 'GLOBAL') elements.push('Global');

  return elements.join(', ');
}

function ContentMetadata(props) {
  const { content } = props;

  return (
    <div className="content-metadata">
      <h5>Keywords</h5>
      <span>{content.keywords.sort().join(', ')}</span>
      <h5>Geographic characterisation:</h5>
      <GeoChar value={content.geochars} />
    </div>
  );
}

export default ContentMetadata;
