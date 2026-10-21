import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider as JotaiProvider } from 'jotai';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CompareToolsPanel } from './CompareToolsPanel';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

const renderPanel = (selectedTools) => {
  window.localStorage.setItem(
    'cca-compare-tools',
    JSON.stringify(selectedTools),
  );

  return render(
    <IntlProvider locale="en">
      <JotaiProvider>
        <CompareToolsPanel />
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
    useSelector.mockReturnValue('en');
    window.history.replaceState({}, '', '/');
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

  it.each(['en', 'fr'])('opens the comparison page in %s', (locale) => {
    useSelector.mockReturnValue(locale);
    window.history.replaceState(
      {},
      '',
      `/${locale}/navigator/tool-catalogue?q=water#results`,
    );
    renderPanel([
      { uid: 'one', title: 'Tool one' },
      { uid: 'two', title: 'Tool two' },
    ]);

    expect(screen.getByText('Ready to compare')).toHaveClass(
      'compare-panel-status',
      'ready',
    );

    fireEvent.click(screen.getByText('Compare selected tools'));

    expect(push).toHaveBeenCalledWith({
      pathname: `/${locale}/navigator/compare`,
      search: '?uid=one&uid=two',
      state: {
        returnURL: `/${locale}/navigator/tool-catalogue?q=water#results`,
      },
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

  it('shows the selected tool type icon and preserves empty slot icons', () => {
    const { container } = renderPanel([
      {
        uid: 'one',
        title: 'Tool one',
        href: '/tools/one',
        tool_type: {
          token: 'RISK_VULNERABILITY_ASSESSMENT',
          title: 'Risk & vulnerability assessment',
        },
      },
    ]);
    const thumbnail = container.querySelector(
      '.compare-panel-tool:not(.placeholder) .navigator-tool-icon',
    );

    expect(thumbnail).toHaveClass('small');
    expect(thumbnail).toHaveAttribute(
      'title',
      'Risk & vulnerability assessment',
    );
    expect(
      thumbnail.querySelector('svg.navigator-tool-type-icon'),
    ).toBeInTheDocument();
    expect(thumbnail.querySelector('.ri-file-line')).not.toBeInTheDocument();
    expect(
      container.querySelectorAll('.placeholder .ri-add-line'),
    ).toHaveLength(3);
    expect(container.querySelector('.placeholder svg')).not.toBeInTheDocument();
  });

  it('uses the placeholder for an older saved selection without tool type', () => {
    const { container } = renderPanel([
      { uid: 'one', title: 'Tool one', href: '/tools/one' },
    ]);
    const thumbnail = container.querySelector('.navigator-tool-icon');

    expect(thumbnail.querySelector('svg')).not.toBeInTheDocument();
    expect(thumbnail.querySelector('.ri-file-line')).toBeInTheDocument();
  });
});
