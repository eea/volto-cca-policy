import { Icon } from 'semantic-ui-react';
import VoltoIcon from '@plone/volto/components/theme/Icon/Icon';
import { getToolTypeIconIcon } from './utils';

const ToolThumbnail = ({
  result,
  size = 'medium',
  fallbackIcon = 'ri-file-line',
}) => {
  const toolType = getToolTypeIconIcon(result);

  return (
    <>
      {toolType ? (
        <div className={`navigator-tool-icon ${size}`} title={toolType?.title}>
          <VoltoIcon
            name={toolType.icon}
            className="navigator-tool-type-icon"
            ariaHidden="true"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        <div
          className={`navigator-tool-icon tool-fallback-icon ${size}`}
          title={toolType?.title}
        >
          <Icon className={fallbackIcon} />
        </div>
      )}
    </>
  );
};

export default ToolThumbnail;
