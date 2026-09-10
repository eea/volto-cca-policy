import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSearchContext } from '@eeacms/search/lib/hocs';
import NavigatorGuideContentView from './NavigatorGuideContentView';
import useGuideFacetOptions from './useGuideFacetOptions';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('react-router-dom', () => ({ useHistory: jest.fn() }));
jest.mock('@eeacms/search/lib/hocs', () => ({ useSearchContext: jest.fn() }));
jest.mock('./useGuideFacetOptions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const renderGuide = (result) => {
  useSearchContext.mockReturnValue({
    filters: [{ field: 'cca_adaptation_sectors.keyword', values: ['Water'] }],
    facets: {},
    results: [result],
    totalResults: 1,
    isLoading: false,
  });
  return render(
    <IntlProvider locale="en">
      <NavigatorGuideContentView appConfig={{ previewResultsLimit: 3 }} />
    </IntlProvider>,
  );
};

describe('NavigatorGuideContentView thumbnails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAtom.mockReturnValue([0, jest.fn()]);
    useSelector.mockReturnValue('en');
    useHistory.mockReturnValue({ push: jest.fn() });
    useGuideFacetOptions.mockReturnValue({});
  });

  it('shows the uploaded result image after loading, with a stack icon while loading', () => {
    const { container } = renderGuide({
      title: 'Guide tool',
      href: '/tools/guide-tool',
      image: { scales: { thumb: { download: '/uploaded-guide-thumb.jpg' } } },
    });
    const thumbnail = container.querySelector('.navigator-tool-icon');
    const img = thumbnail.querySelector('img');

    expect(thumbnail).toHaveClass('medium');
    expect(thumbnail).toHaveAttribute('aria-hidden', 'true');
    expect(img).toHaveAttribute('src', '/uploaded-guide-thumb.jpg');
    expect(img).toHaveStyle({ display: 'none' });
    expect(thumbnail.querySelector('.ri-stack-line')).toBeInTheDocument();

    fireEvent.load(img);

    expect(img).not.toHaveStyle({ display: 'none' });
    expect(thumbnail.querySelector('.ri-stack-line')).not.toBeInTheDocument();
  });

  it('falls back to the stack icon when the image fails', () => {
    const { container } = renderGuide({
      title: 'Guide tool',
      href: '/tools/guide-tool',
      image: '/broken.jpg',
    });
    const thumbnail = container.querySelector('.navigator-tool-icon');

    fireEvent.error(thumbnail.querySelector('img'));

    expect(thumbnail.querySelector('img')).not.toBeInTheDocument();
    expect(thumbnail.querySelector('.ri-stack-line')).toBeInTheDocument();
  });

  it.each([null, false])('shows the stack icon for image: %s', (image) => {
    const { container } = renderGuide({
      title: 'Guide tool',
      href: '/tools/guide-tool',
      image,
    });
    const thumbnail = container.querySelector('.navigator-tool-icon');

    expect(thumbnail.querySelector('img')).not.toBeInTheDocument();
    expect(thumbnail.querySelector('.ri-stack-line')).toBeInTheDocument();
  });
});
