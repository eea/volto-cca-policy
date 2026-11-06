import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import RelatedTools from './RelatedTools';

jest.mock('@plone/volto/components/manage/UniversalLink/UniversalLink', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock('@eeacms/volto-cca-policy/components/theme/TagOverflowPopup', () => ({
  __esModule: true,
  default: ({ items }) => <div>{items.join(', ')}</div>,
}));

jest.mock(
  '@eeacms/volto-cca-policy/components/theme/ToolThumbnail/ToolThumbnail',
  () => () => null,
);

jest.mock('semantic-ui-react', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Icon: () => null,
}));

describe('RelatedTools vocabulary translations', () => {
  it('translates visible and overflow adaptation cycle labels', () => {
    render(
      <IntlProvider
        locale="fr"
        messages={{
          'Related tools': 'Related tools',
          'Tools sharing a sector, hazard or cycle step with this one — useful next steps for the same question.':
            'Tools sharing a sector, hazard or cycle step with this one — useful next steps for the same question.',
          View: 'View',
          'Step 1: Preparing the Ground for Adaptation':
            "Étape 1 : Préparer le terrain pour l'adaptation",
          'Step 2: Assessing Climate Change Risks and Vulnerabilities':
            'Étape 2 : Évaluer les risques et les vulnérabilités climatiques',
        }}
      >
        <RelatedTools
          content={{
            adaptation_support_cycle_step: [
              {
                token: 'STEP_1',
                title: 'Step 1: Preparing the Ground for Adaptation',
              },
              {
                token: 'STEP_2',
                title:
                  'Step 2: Assessing Climate Change Risks and Vulnerabilities',
              },
            ],
            '@components': {
              relatedtools: {
                items: [
                  {
                    '@id': '/related-tool',
                    title: 'Related tool',
                    tool_provider: 'Provider',
                    shared: {
                      adaptation_support_cycle_step: ['STEP_1', 'STEP_2'],
                    },
                  },
                ],
              },
            },
          }}
        />
      </IntlProvider>,
    );

    expect(screen.getByText('Étape 1')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Étape 2 : Évaluer les risques et les vulnérabilités climatiques',
      ),
    ).toBeInTheDocument();
  });
});
