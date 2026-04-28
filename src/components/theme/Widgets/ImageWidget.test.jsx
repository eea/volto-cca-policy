import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';

import ImageWidget from './ImageWidget';

global.__SERVER__ = false;

// mock Dropzone (avoids drag/drop complexity)
jest.mock(
  'react-dropzone',
  () => (props) =>
    props.children({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
    }),
);

// mock loadable
jest.mock('@loadable/component', () => (importFn) => {
  const Component = (props) => {
    const Loaded = require('react-dropzone');
    return <Loaded {...props} />;
  };
  return Component;
});

const mockStore = configureStore();

describe('ImageUploadWidget', () => {
  it('renders empty state', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const props = {
      id: 'image',
      title: 'Image',
      value: null,
      onChange: jest.fn(),
    };

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ImageWidget {...props} />
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toBeTruthy();
  });

  it('renders with image value', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const props = {
      id: 'image',
      title: 'Image',
      value: {
        data: 'fakebase64',
        encoding: 'base64',
        'content-type': 'image/png',
        filename: 'test.png',
      },
      onChange: jest.fn(),
    };

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ImageWidget {...props} />
        </MemoryRouter>
      </Provider>,
    );

    expect(getByText('test.png')).toBeInTheDocument();
  });
});
