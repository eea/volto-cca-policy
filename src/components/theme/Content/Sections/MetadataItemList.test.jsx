import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import MetadataItemList from './MetadataItemList';

const renderComponent = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <MetadataItemList {...props} />
    </IntlProvider>,
  );

describe('MetadataItemList', () => {
  it('renders vocabulary objects and plain strings', () => {
    renderComponent({ value: [{ title: 'Flooding' }, 'Drought'] });

    expect(screen.getByText('Flooding, Drought')).toBeInTheDocument();
  });

  it('renders comma-separated items inline', () => {
    renderComponent({ value: ['Flooding', 'Drought'], asInline: true });

    expect(screen.getByText('Flooding, Drought')).toHaveClass(
      'metadata-inline',
    );
  });

  it('renders a plain stacked list', () => {
    renderComponent({ value: ['Step one', 'Step two'], asList: true });

    const list = screen.getByRole('list');
    expect(list).toHaveClass('metadata-list');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('Step two')).toBeInTheDocument();
  });

  it('shows collapsed items in a popup on hover', async () => {
    renderComponent({
      value: ['One', 'Two', 'Three', 'Four', 'Five'],
      asTags: true,
      maxItems: 3,
    });

    expect(screen.getByText('One')).toHaveClass('metadata-tag');
    expect(screen.getByText('Two')).toHaveClass('metadata-tag');
    expect(screen.getByText('Three')).toHaveClass('metadata-tag');
    const moreButton = screen.getByRole('button', {
      name: 'Additional items: Four, Five',
    });

    expect(moreButton).toHaveTextContent('+ 2');
    expect(moreButton).toHaveClass('metadata-tag', 'metadata-tag-more');
    expect(screen.queryByText('Four')).not.toBeInTheDocument();

    fireEvent.mouseOver(moreButton);

    expect(await screen.findByText('Four')).toBeInTheDocument();
    expect(screen.getByText('Five')).toBeInTheDocument();
  });
});
