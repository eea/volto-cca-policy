import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import ToolThumbnail from './ToolThumbnail';

describe('ToolThumbnail', () => {
  it.each(['load', 'error'])(
    'resets the %s state when the thumbnail URL changes',
    (event) => {
      const { container, rerender } = render(
        <ToolThumbnail result={{ image: '/first.jpg' }} />,
      );
      fireEvent[event](container.querySelector('img'));

      rerender(<ToolThumbnail result={{ image: '/second.jpg' }} />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/second.jpg');
      expect(img).toHaveAttribute('alt', '');
      expect(img).toHaveStyle({ display: 'none' });
      expect(container.querySelector('.ri-file-line')).toBeInTheDocument();

      fireEvent.load(img);

      expect(img.style.display).toBe('');
      expect(container.querySelector('.ri-file-line')).not.toBeInTheDocument();
    },
  );
});
