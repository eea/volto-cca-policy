import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ItemsSection from './ItemsSection';
import defaultImage from '@eeacms/volto-cca-policy/../theme/assets/images/image-narrow.svg';

jest.mock('@eeacms/volto-cca-policy/utils', () => ({
  normalizeImageFileName: (filename) => filename?.toLowerCase() || '',
}));

describe('ItemsSection', () => {
  it('renders nothing when items is empty or undefined', () => {
    const { container, rerender } = render(<ItemsSection items={[]} />);
    expect(container.firstChild).toBeNull();

    rerender(<ItemsSection />);
    expect(container.firstChild).toBeNull();
  });

  it('renders default image when item has no icon', () => {
    const mockItems = [{ Sector: 'Water' }];
    render(<ItemsSection items={mockItems} field="Sector" iconPath="sector" />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', defaultImage);
    expect(screen.getByText('Water')).toBeInTheDocument();
  });

  it('renders custom image when icon is provided', () => {
    const mockItems = [{ Sector: 'Energy', Icon: 'Solar' }];
    render(<ItemsSection items={mockItems} field="Sector" iconPath="sector" />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute(
      'src',
      '/en/mission/icons/signatory-reporting/sector/solar/@@images/image',
    );
    expect(screen.getByText('Energy')).toBeInTheDocument();
  });

  it('applies "column" class when more than 3 items exist', () => {
    const mockItems = [
      { Sector: 'Water' },
      { Sector: 'Energy' },
      { Sector: 'Agriculture' },
      { Sector: 'Transport' },
    ];

    const { container } = render(
      <ItemsSection items={mockItems} field="Sector" iconPath="sector" />,
    );

    const group = container.querySelector('.items-group');
    expect(group).toHaveClass('column');
  });

  it('does not apply "column" class when 3 or fewer items', () => {
    const mockItems = [
      { Sector: 'Water' },
      { Sector: 'Energy' },
      { Sector: 'Agriculture' },
    ];

    const { container } = render(
      <ItemsSection items={mockItems} field="Sector" iconPath="sector" />,
    );

    const group = container.querySelector('.items-group');
    expect(group).not.toHaveClass('column');
  });
});
