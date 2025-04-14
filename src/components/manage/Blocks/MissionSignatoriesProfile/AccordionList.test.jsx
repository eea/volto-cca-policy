import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import AccordionList from './AccordionList';

describe('AccordionList', () => {
  const mockAccordions = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
  ];

  it('renders all accordion titles', () => {
    const { getByText } = render(<AccordionList accordions={mockAccordions} />);
    expect(getByText('Section 1')).toBeInTheDocument();
    expect(getByText('Section 2')).toBeInTheDocument();
  });

  it('toggles accordion content on title click', () => {
    const { getByText, container } = render(
      <AccordionList accordions={mockAccordions} />,
    );

    const contentDiv = container.querySelector('.content');

    expect(contentDiv).not.toHaveClass('active');

    fireEvent.click(getByText('Section 1'));
    expect(contentDiv).toHaveClass('active');

    fireEvent.click(getByText('Section 1'));
    expect(contentDiv).not.toHaveClass('active');
  });
});
