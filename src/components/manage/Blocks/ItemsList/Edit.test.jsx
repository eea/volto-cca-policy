import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.doMock('@plone/volto/components/manage/Sidebar/SidebarPortal', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="sidebar-portal">{children}</div>,
}));

jest.doMock('@plone/volto/components/manage/Form/BlockDataForm', () => ({
  __esModule: true,
  default: ({ onChangeField }) => (
    <>
      <button
        type="button"
        onClick={() =>
          onChangeField('items', [
            {
              custom_icon: {
                '@id': '/en/icons/first',
                scales: {
                  image: { download: 'first/@@images/image-800.svg' },
                },
              },
              custom_hover_icon: {
                '@id': '/en/icons/second',
                scales: {
                  image: {
                    download: '/en/icons/second/@@images/image.svg',
                  },
                },
              },
            },
            { custom_icon: '/en/icons/direct.svg', custom_hover_icon: null },
            { custom_icon: { '@id': '/en/icons/fallback' } },
            {},
          ])
        }
      >
        Save item icons
      </button>
      <button type="button" onClick={() => onChangeField('title', 'Updated')}>
        Change title
      </button>
    </>
  ),
}));

jest.doMock('@plone/volto/components/manage/Widgets/NumberWidget', () => ({
  __esModule: true,
  default: () => null,
}));

jest.doMock('./View', () => ({
  __esModule: true,
  default: ({ mode }) => <div data-testid="items-list-preview">{mode}</div>,
}));

const Edit = require('./Edit').default;

describe('ItemsList Edit', () => {
  it('renders the preview and persists direct icon rendition paths separately', () => {
    const onChangeBlock = jest.fn();
    const block = 'block-id';
    const data = { title: 'Existing title' };

    render(
      <Edit
        block={block}
        data={data}
        id="items"
        selected
        onChangeBlock={onChangeBlock}
      />,
    );

    expect(screen.getByTestId('items-list-preview')).toHaveTextContent('edit');
    expect(screen.getByTestId('sidebar-portal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save item icons' }));

    expect(onChangeBlock).toHaveBeenCalledWith(block, {
      ...data,
      items: [
        {
          custom_icon: {
            '@id': '/en/icons/first',
            scales: {
              image: { download: 'first/@@images/image-800.svg' },
            },
          },
          custom_hover_icon: {
            '@id': '/en/icons/second',
            scales: {
              image: { download: '/en/icons/second/@@images/image.svg' },
            },
          },
          custom_icon_path: '/en/icons/first/first/@@images/image-800.svg',
          custom_hover_icon_path: '/en/icons/second/@@images/image.svg',
        },
        {
          custom_icon: '/en/icons/direct.svg',
          custom_hover_icon: null,
          custom_icon_path: '/en/icons/direct.svg',
          custom_hover_icon_path: '',
        },
        {
          custom_icon: { '@id': '/en/icons/fallback' },
          custom_icon_path: '/en/icons/fallback/@@images/image',
          custom_hover_icon_path: '',
        },
        { custom_icon_path: '', custom_hover_icon_path: '' },
      ],
    });
  });

  it('passes non-item changes through unchanged', () => {
    const onChangeBlock = jest.fn();
    render(
      <Edit block="block-id" data={{}} onChangeBlock={onChangeBlock} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Change title' }));
    expect(onChangeBlock).toHaveBeenCalledWith('block-id', {
      title: 'Updated',
    });
  });
});
