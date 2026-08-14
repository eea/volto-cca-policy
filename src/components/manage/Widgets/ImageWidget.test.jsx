import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';

import ImageWidget from './ImageWidget';

global.__SERVER__ = false;

const mockOpenObjectBrowser = jest.fn();
const mockReadAsDataURL = jest.fn();
let mockDropzoneProps;

jest.mock('promise-file-reader', () => ({
  readAsDataURL: (...args) => mockReadAsDataURL(...args),
}));

jest.mock('@plone/volto/helpers/FormValidation/FormValidation', () => ({
  validateFileUploadSize: jest.fn(() => true),
}));

jest.mock(
  '@plone/volto/components/manage/Sidebar/ObjectBrowser',
  () => (Component) => (props) => (
    <Component {...props} openObjectBrowser={mockOpenObjectBrowser} />
  ),
);

jest.mock(
  '@plone/volto/components/manage/Widgets/ImageWidget',
  () => (props) => (
    <div data-testid="native-image-widget" data-value={props.value} />
  ),
);

// mock Dropzone (avoids drag/drop complexity)
jest.mock('react-dropzone', () => (props) => {
  mockDropzoneProps = props;
  return props.children({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
  });
});

// mock loadable
jest.mock('@loadable/component', () => (importFn) => {
  const Component = (props) => {
    const Loaded = require('react-dropzone');
    return <Loaded {...props} />;
  };
  return Component;
});

const mockStore = configureStore();

const renderWidget = (props) => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/current-page']}>
        <ImageWidget id="image" title="Image" onChange={jest.fn()} {...props} />
      </MemoryRouter>
    </Provider>,
  );
};

describe('ImageUploadWidget', () => {
  it('renders empty state', () => {
    const { container } = renderWidget({ value: null });

    expect(container).toBeTruthy();
  });

  it('renders with image value', () => {
    const { getByText } = renderWidget({
      value: {
        data: 'fakebase64',
        encoding: 'base64',
        'content-type': 'image/png',
        filename: 'test.png',
      },
    });

    expect(getByText('test.png')).toBeInTheDocument();
  });

  it('renders external image URLs and clears them from the toolbar', () => {
    const onChange = jest.fn();
    const { container } = renderWidget({
      value: 'https://example.com/images/photo.jpg',
      onChange,
    });

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://example.com/images/photo.jpg',
    );
    expect(container).toHaveTextContent('photo.jpg');

    fireEvent.click(container.querySelector('.delete-btn'));
    expect(onChange).toHaveBeenCalledWith('image', null);
  });

  it.each([
    ['download metadata', { download: '/photo/@@images/image' }, '/photo'],
    ['linked metadata', { '@id': '/photo' }, '/photo'],
    [
      'inline image data',
      {
        data: 'fakebase64',
        encoding: 'base64',
        'content-type': 'image/png',
      },
      '',
    ],
  ])(
    'sanitizes %s for the native attached-image widget',
    (_, value, expected) => {
      const { getByTestId } = renderWidget({
        block: 'block-id',
        widget: 'attachedimage',
        value,
      });

      expect(getByTestId('native-image-widget')).toHaveAttribute(
        'data-value',
        expected,
      );
    },
  );

  it('uploads a dropped file as an inline image value', async () => {
    const onChange = jest.fn();
    const file = new File(['image'], 'climate.png', { type: 'image/png' });
    mockReadAsDataURL.mockResolvedValueOnce('data:image/png;base64,aW1hZ2U=');

    renderWidget({ value: null, onChange });

    await act(async () => {
      mockDropzoneProps.onDrop([file]);
    });

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith('image', {
        data: 'aW1hZ2U=',
        encoding: 'base64',
        'content-type': 'image/png',
        filename: 'climate.png',
      }),
    );
  });

  it('updates drag state and delegates an existing image selection', async () => {
    const onSelectItem = jest.fn();
    const { getByLabelText, container } = renderWidget({
      value: null,
      onSelectItem,
    });

    act(() => mockDropzoneProps.onDragEnter());
    expect(container.querySelector('.active.dimmer')).toBeInTheDocument();

    act(() => mockDropzoneProps.onDragLeave());
    expect(container.querySelector('.active.dimmer')).not.toBeInTheDocument();

    fireEvent.click(getByLabelText('Pick an existing image'));
    expect(mockOpenObjectBrowser).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'image',
        currentPath: '/current-page',
      }),
    );

    const { onSelectItem: selectFromBrowser } =
      mockOpenObjectBrowser.mock.calls[0][0];
    await selectFromBrowser('/photo', { title: 'Photo' });
    expect(onSelectItem).toHaveBeenCalledWith('/photo', { title: 'Photo' });
  });
});
