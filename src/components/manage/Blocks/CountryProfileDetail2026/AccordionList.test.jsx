import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccordionList from './AccordionList';

describe('AccordionList', () => {
  it('renders each item and toggles its content', () => {
    render(
      <AccordionList
        elements={[
          { Title: 'First section', Text: '<p>First content</p>' },
          { Title: 'Second section', Text: '<p>Second content</p>' },
        ]}
      />,
    );

    const firstTitle = screen.getByText('First section').closest('.title');
    const firstContent = screen.getByText('First content').closest('.content');
    expect(firstTitle).not.toHaveClass('active');
    fireEvent.click(firstTitle);
    expect(firstTitle).toHaveClass('active');
    expect(firstContent).toHaveClass('active');
    expect(screen.getByText('First content')).toBeInTheDocument();

    fireEvent.click(firstTitle);
    expect(firstTitle).not.toHaveClass('active');
  });
});
