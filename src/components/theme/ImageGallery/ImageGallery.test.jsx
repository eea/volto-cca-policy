import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageGallery from './ImageGallery';

jest.mock('react-slick', () => (props) => (
  <div data-testid="mock-slider">{props.children}</div>
));

const mockItems = [
  {
    url: 'https://example.com/image1.jpg',
    title: 'Image One',
    description: 'First image description',
    rights: 'Author One',
  },
  {
    url: 'https://example.com/image2.jpg',
    title: 'Image Two',
    description: 'Second image description',
  },
];

describe('ImageGallery', () => {
  it('renders preview image and opens modal on click', () => {
    render(<ImageGallery items={mockItems} />);

    const previewImage = screen.getByRole('img', { name: /Image One/i });
    expect(previewImage).toBeInTheDocument();

    expect(
      screen.queryByText('First image description'),
    ).not.toBeInTheDocument();

    fireEvent.click(previewImage);

    expect(screen.getByText('Image One')).toBeInTheDocument();
    expect(screen.getByText('First image description')).toBeInTheDocument();
  });
});
