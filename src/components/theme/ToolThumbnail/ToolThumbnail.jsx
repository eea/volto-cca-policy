import React, { useEffect, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import Image from '@plone/volto/components/theme/Image/Image';
import { getToolThumbnailUrl } from './utils';

const ToolThumbnail = ({
  result,
  size = 'medium',
  fallbackIcon = 'ri-file-line',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const thumbUrl = getToolThumbnailUrl(result);

  useEffect(() => {
    setImageLoaded(false);
    setHasImageError(false);
  }, [thumbUrl]);

  return (
    <div className={`navigator-tool-icon ${size}`} aria-hidden="true">
      {thumbUrl && !hasImageError ? (
        <>
          <Image
            src={thumbUrl}
            alt=""
            style={imageLoaded ? undefined : { display: 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setHasImageError(true)}
          />
          {!imageLoaded && <Icon className={fallbackIcon} />}
        </>
      ) : (
        <Icon className={fallbackIcon} />
      )}
    </div>
  );
};

export default ToolThumbnail;
