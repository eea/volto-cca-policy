import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import ToolThumbnail from './ToolThumbnail';

describe('ToolThumbnail', () => {
  it('renders the circle icon with the category tooltip', () => {
    const { container } = render(
      <ToolThumbnail
        result={{
          tool_type: {
            token: 'HAZARD_RISK_MAP_VIEWER',
            title: 'Hazard & risk map viewer',
          },
        }}
        size="large"
      />,
    );

    const wrapper = container.querySelector('.navigator-tool-icon');
    expect(wrapper).toHaveClass('navigator-tool-icon', 'large');
    expect(wrapper).toHaveAttribute('title', 'Hazard & risk map viewer');
    expect(
      container.querySelector('svg.navigator-tool-type-icon'),
    ).toBeInTheDocument();
    expect(container.querySelector('.ri-file-line')).not.toBeInTheDocument();
  });

  it('uses the current placeholder when the tool has no category', () => {
    const { container } = render(
      <ToolThumbnail result={{ image: '/old-thumbnail.jpg' }} />,
    );

    const wrapper = container.querySelector('.navigator-tool-icon');
    expect(wrapper).toHaveClass('tool-fallback-icon', 'medium');
    expect(wrapper.querySelector('svg')).not.toBeInTheDocument();
    expect(wrapper.querySelector('.ri-file-line')).toBeInTheDocument();
  });
});
