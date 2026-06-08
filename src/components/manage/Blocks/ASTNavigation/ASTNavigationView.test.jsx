import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ASTNavigationView from './ASTNavigationView';

jest.mock('@loadable/component', () => {
  let callCount = 0;

  return () => {
    callCount += 1;
    const componentName = callCount === 1 ? 'ASTLogoMap' : 'UASTLogoMap';

    return ({ items, pathname, href }) => (
      <div
        data-testid={componentName}
        data-items={JSON.stringify(items)}
        data-pathname={pathname}
        data-href={href}
      >
        {componentName}
      </div>
    );
  };
});

describe('ASTNavigationView', () => {
  const makeItems = () =>
    Array.from({ length: 6 }, (_, index) => ({
      href: [`/en/source-${index + 1}`],
      title: `Source ${index + 1}`,
    }));

  it('renders an incomplete source warning when items length is not 6', () => {
    const data = {
      items: [],
      image_type: 'ast',
      href: ['/en/ast-nav'],
    };

    const { container } = render(
      <ASTNavigationView path="/en/ast-nav" data={data} />,
    );

    expect(container).toHaveTextContent('Incomplete number of sources');
  });

  it('renders ASTLogoMap when image_type is ast and items length is 6', () => {
    const data = {
      items: makeItems(),
      image_type: 'ast',
      href: ['/en/ast-nav'],
    };

    render(<ASTNavigationView path="/en/ast-nav" data={data} />);

    const astLogoMap = screen.getByTestId('ASTLogoMap');
    expect(astLogoMap).toBeInTheDocument();
    expect(astLogoMap.dataset.pathname).toBe('/en/ast-nav');
    expect(astLogoMap.dataset.href).toBe('/en/ast-nav');
    expect(astLogoMap.dataset.items).toBe(
      JSON.stringify({
        'step-1': '/en/source-1',
        'step-2': '/en/source-2',
        'step-3': '/en/source-3',
        'step-4': '/en/source-4',
        'step-5': '/en/source-5',
        'step-6': '/en/source-6',
      }),
    );
  });

  it('renders UASTLogoMap when image_type is uast and items length is 6', () => {
    const data = {
      items: makeItems(),
      image_type: 'uast',
      href: ['/en/ast-nav'],
    };

    render(<ASTNavigationView path="/en/ast-nav" data={data} />);

    const uastLogoMap = screen.getByTestId('UASTLogoMap');
    expect(uastLogoMap).toBeInTheDocument();
    expect(uastLogoMap.dataset.pathname).toBe('/en/ast-nav');
    expect(uastLogoMap.dataset.href).toBe('/en/ast-nav');
  });

  it('renders nothing when image_type is unsupported and items length is 6', () => {
    const data = {
      items: makeItems(),
      image_type: 'unsupported',
      href: ['/en/ast-nav'],
    };

    const { container } = render(
      <ASTNavigationView path="/en/ast-nav" data={data} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
