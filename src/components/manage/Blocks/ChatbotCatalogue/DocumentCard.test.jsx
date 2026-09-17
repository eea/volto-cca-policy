import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { ChatMessageContext } from '@eeacms/volto-eea-chatbot/ChatBlock/chat';
import { useCatalogueDoc } from './useCatalogueDoc';
import {
  CcaDocCard,
  DocCardErrorBoundary,
  InlineDocCard,
  cleanDocumentTitle,
  matchesDocumentTitle,
} from './DocumentCard';

jest.mock('@eeacms/volto-eea-chatbot/ChatBlock/chat', () => ({
  ChatMessageContext:
    // eslint-disable-next-line global-require
    require('react').createContext(null),
}));

let mockNavigatorShouldThrow = false;

jest.mock(
  '@eeacms/volto-cca-policy/components/Search/NavigatorCatalogue/NavigatorCatalogueCardItem',
  () => (props) => {
    if (mockNavigatorShouldThrow) {
      throw new RangeError('Invalid time value');
    }
    return <div data-testid="navigator-card" />;
  },
);

jest.mock('./useCatalogueDoc', () => ({
  useCatalogueDoc: jest.fn(() => ({ result: null, loading: false })),
}));

const doc = {
  semantic_identifier: 'France: National Adaptation Strategy',
  blurb: 'The French NAS.',
  updated_at: '2023-05-01T00:00:00Z',
  source_type: 'document',
  link: 'https://example.com/france-nas',
};

describe('cleanDocumentTitle', () => {
  it('strips pipe-separated suffixes', () => {
    expect(
      cleanDocumentTitle('Climate policy radar | Tools | Something else'),
    ).toBe('Climate policy radar');
  });

  it('returns trimmed title when no pipe is present', () => {
    expect(cleanDocumentTitle('  Some Title  ')).toBe('Some Title');
  });

  it('handles null and undefined gracefully', () => {
    expect(cleanDocumentTitle(null)).toBe('');
    expect(cleanDocumentTitle(undefined)).toBe('');
    expect(cleanDocumentTitle(123)).toBe('');
  });
});

describe('matchesDocumentTitle', () => {
  it('matches identical titles', () => {
    expect(matchesDocumentTitle('Same Title', 'Same Title')).toBe(true);
  });

  it('matches case-insensitively and with trimmed whitespace', () => {
    expect(matchesDocumentTitle('  Title One  ', 'title one')).toBe(true);
  });

  it('matches noisy document titles with clean search titles', () => {
    expect(
      matchesDocumentTitle(
        'Nature DEMO | Tools | Discover the key services',
        'Nature DEMO',
      ),
    ).toBe(true);
  });

  it('returns false for non-matching or empty titles', () => {
    expect(matchesDocumentTitle('Alpha', 'Beta')).toBe(false);
    expect(matchesDocumentTitle(null, 'Beta')).toBe(false);
    expect(matchesDocumentTitle('Alpha', '')).toBe(false);
  });
});

describe('InlineDocCard', () => {
  beforeEach(() => {
    useCatalogueDoc.mockReset();
    useCatalogueDoc.mockReturnValue({ result: null, loading: false });
  });

  it('renders nothing when no document matches', () => {
    const { container } = render(
      <InlineDocCard title="Unknown Title" documents={[doc]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when ES lookup returns empty (not found in ES)', () => {
    useCatalogueDoc.mockReturnValue({
      result: null,
      loading: false,
    });
    const { container } = render(
      <InlineDocCard title={doc.semantic_identifier} documents={[doc]} />,
    );
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('navigator-card')).not.toBeInTheDocument();
  });

  it('renders the Navigator card once the ES lookup resolves with a document', () => {
    useCatalogueDoc.mockReturnValue({
      result: { found: true, uid: 'https://example.com/france-nas' },
      loading: false,
    });
    render(<InlineDocCard title={doc.semantic_identifier} documents={[doc]} />);
    expect(screen.getByTestId('navigator-card')).toBeInTheDocument();
    expect(useCatalogueDoc).toHaveBeenCalledWith(doc.link);
  });

  it('matches title case-insensitively and renders card when ES lookup resolves', () => {
    useCatalogueDoc.mockReturnValue({
      result: { found: true, uid: 'https://example.com/france-nas' },
      loading: false,
    });
    render(
      <InlineDocCard
        title="  france: NATIONAL adaptation strategy  "
        documents={[doc]}
      />,
    );
    expect(screen.getByTestId('navigator-card')).toBeInTheDocument();
    expect(useCatalogueDoc).toHaveBeenCalledWith(doc.link);
  });

  it('cleans pipeline title noise and matches cleanly when ES lookup resolves', () => {
    const noisyDoc = {
      ...doc,
      semantic_identifier:
        'Climate policy radar | Tools | Discover the key services, thematic features and tools of Climate-ADAPT Climate-ADAPT',
    };
    useCatalogueDoc.mockReturnValue({
      result: { found: true, uid: doc.link },
      loading: false,
    });
    render(
      <InlineDocCard title="Climate policy radar" documents={[noisyDoc]} />,
    );
    expect(screen.getByTestId('navigator-card')).toBeInTheDocument();
    expect(useCatalogueDoc).toHaveBeenCalledWith(doc.link);
  });

  it('calls useCatalogueDoc with undefined when no match is found, rendering nothing', () => {
    const { container } = render(
      <InlineDocCard title="No Match" documents={[]} />,
    );
    expect(useCatalogueDoc).toHaveBeenCalledWith(undefined);
    expect(container.firstChild).toBeNull();
  });
});

describe('CcaDocCard', () => {
  beforeEach(() => {
    useCatalogueDoc.mockReset();
    useCatalogueDoc.mockReturnValue({ result: null, loading: false });
  });

  it('matches the marker against owning message documents and renders when ES resolves', () => {
    useCatalogueDoc.mockReturnValue({
      result: { found: true, uid: doc.link },
      loading: false,
    });
    render(
      <ChatMessageContext.Provider value={{ documents: [doc] }}>
        <CcaDocCard title={doc.semantic_identifier} />
      </ChatMessageContext.Provider>,
    );
    expect(screen.getByTestId('navigator-card')).toBeInTheDocument();
  });

  it('renders nothing when message context is absent', () => {
    const { container } = render(
      <CcaDocCard title={doc.semantic_identifier} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when message has no documents', () => {
    const { container } = render(
      <ChatMessageContext.Provider value={{ documents: [] }}>
        <CcaDocCard title={doc.semantic_identifier} />
      </ChatMessageContext.Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when the rich catalogue card throws an error (caught by error boundary)', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    useCatalogueDoc.mockReturnValue({
      result: { title: 'Crashing Tool' },
      loading: false,
    });

    mockNavigatorShouldThrow = true;

    try {
      const { container } = render(
        <ChatMessageContext.Provider value={{ documents: [doc] }}>
          <CcaDocCard title={doc.semantic_identifier} />
        </ChatMessageContext.Provider>,
      );

      expect(container.firstChild).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
    } finally {
      mockNavigatorShouldThrow = false;
      warnSpy.mockRestore();
    }
  });
});

describe('DocCardErrorBoundary', () => {
  it('renders custom fallback when provided and an error occurs', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <DocCardErrorBoundary fallback={<div>Fallback Content</div>}>
        <ThrowingComponent />
      </DocCardErrorBoundary>,
    );

    expect(getByText('Fallback Content')).toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
