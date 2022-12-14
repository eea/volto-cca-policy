import imageFitSVG from '@plone/volto/icons/image-fit.svg';
import imageWideSVG from '@plone/volto/icons/image-wide.svg';

import imageNarrowSVG from '@eeacms/volto-cca-policy/icons/image-narrow.svg';

export const ALIGN_INFO_MAP = {
  narrow_view: [imageNarrowSVG, 'Narrow width'],
  container_view: [imageFitSVG, 'Container width'],
  wide_view: [imageWideSVG, 'Wide width'],
};

export const EditSchema = () => {
  return {
    title: 'Page layout settings',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['layout_size'],
      },
    ],
    required: [],
    properties: {
      layout_size: {
        widget: 'style_align',
        title: 'Layout size',
        actions: Object.keys(ALIGN_INFO_MAP),
        actionsInfoMap: ALIGN_INFO_MAP,
      },
    },
  };
};
