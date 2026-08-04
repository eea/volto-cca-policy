import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider as JotaiProvider } from 'jotai';
import { useHistory } from 'react-router-dom';
import { CompareToolsPanel } from './CompareToolsPanel';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector) => selector({ intl: { locale: 'en' } }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

const renderPanel = (selectedTools, appConfig) => {
  window.localStorage.setItem(
    'cca-compare-tools',
    JSON.stringify(selectedTools),
  );

  return render(
    <IntlProvider locale="en">
      <JotaiProvider>
        <CompareToolsPanel appConfig={appConfig} />
      </JotaiProvider>
    </IntlProvider>,
  );
};

describe('CompareToolsPanel', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    useHistory.mockReturnValue({ push });
  });

  it('does not render without selected tools', () => {
    const { container } = renderPanel([]);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows an incomplete warning and removes the only tool', () => {
    renderPanel([{ uid: 'one', title: 'Tool one' }]);

    expect(screen.getByText('Add at least another tool')).toHaveClass(
      'compare-panel-status',
      'incomplete',
    );
    expect(
      screen.getByText('Compare selected tools').closest('button'),
    ).toBeDisabled();

    fireEvent.click(screen.getByLabelText('Remove Tool one'));
    expect(screen.queryByText('Compare tools')).not.toBeInTheDocument();
  });

  it('shows the ready state and opens the comparison page', () => {
    renderPanel(
      [
        { uid: 'one', title: 'Tool one' },
        { uid: 'two', title: 'Tool two' },
      ],
      { landingPageURL: '/en/navigator/tool-catalogue' },
    );

    expect(screen.getByText('Ready to compare')).toHaveClass(
      'compare-panel-status',
      'ready',
    );

    fireEvent.click(screen.getByText('Compare selected tools'));

    expect(push).toHaveBeenCalledWith({
      pathname: '/en/navigator/compare',
      search: '?uid=one&uid=two',
      state: { returnURL: '/' },
    });
  });

  it('clears all selected tools', () => {
    renderPanel([
      { uid: 'one', title: 'Tool one' },
      { uid: 'two', title: 'Tool two' },
    ]);

    fireEvent.click(screen.getByText('Clear all'));
    expect(screen.queryByText('Compare tools')).not.toBeInTheDocument();
  });
});
