import React from 'react';
import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';

import { ChatMessageContext } from '@eeacms/volto-eea-chatbot/ChatBlock/chat';
import { useCatalogueDoc } from './useCatalogueDoc';
import { CcaDocCard, InlineDocCard } from './DocumentCard';

jest.mock('@eeacms/volto-eea-chatbot/ChatBlock/chat', () => ({
  ChatMessageContext:
    // eslint-disable-next-line global-require
    require('react').createContext(null),
}));

jest.mock(
  '@eeacms/volto-cca-policy/components/Search/NavigatorCatalogue/NavigatorCatalogueCardItem',
  () =>
    ({ result }) => <div data-testid="navigator-card" />,
);

jest.mock('./useCatalogueDoc', () => ({
  useCatalogueDoc: jest.fn(() => ({ result: null, loading: true })),
}));

const doc = {
  semantic_identifier: 'France: National Adaptation Strategy',
  blurb: 'The French NAS.',
  updated_at: '2023-05-01T00:00:00Z',
  source_type: 'document',
  link: 'https://example.com/france-nas',
};

const webDoc = {
  semantic_identifier: 'Some Web Source',
  blurb: 'A web page.',
  updated_at: '2023-05-01T00:00:00Z',
  source_type: 'web',
  link: 'https://example.com/web',
};

describe('InlineDocCard', () => {
  beforeEach(() => {
    useCatalogueDoc.mockReset();
    useCatalogueDoc.mockReturnValue({ result: null, loading: true });
  });

  it('renders a basic card with the marker title when no document matches', () => {
    render(<InlineDocCard title="Unknown Title" documents={[doc]} />);
    expect(screen.getByText('Unknown Title')).toBeInTheDocument();
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.queryByText('The French NAS.')).not.toBeInTheDocument();
  });

  it('matches the title case-insensitively and enriches with the document metadata', () => {
    render(
      <InlineDocCard
        title="  france: NATIONAL adaptation strategy  "
        documents={[doc]}
      />,
    );
    expect(screen.getByText('The French NAS.')).toBeInTheDocument();
    expect(screen.getByText('01 May 23')).toBeInTheDocument();
  });

  it('renders the title as a link for web documents', () => {
    render(<InlineDocCard title="Some Web Source" documents={[webDoc]} />);
    const link = screen.getByRole('link', { name: 'Some Web Source' });
    expect(link).toHaveAttribute('href', 'https://example.com/web');
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByText('Web')).toBeInTheDocument();
  });

  it('omits the date when updated_at is missing or invalid', () => {
    const noDate = { ...doc, updated_at: undefined };
    render(
      <InlineDocCard title={doc.semantic_identifier} documents={[noDate]} />,
    );
    expect(screen.queryByText('01 May 23')).not.toBeInTheDocument();
    cleanup();

    const badDate = { ...doc, updated_at: 'not-a-date' };
    render(
      <InlineDocCard title={doc.semantic_identifier} documents={[badDate]} />,
    );
    expect(screen.queryByText('01 May 23')).not.toBeInTheDocument();
    cleanup();

    render(<InlineDocCard title={doc.semantic_identifier} documents={[]} />);
    expect(screen.getByText(doc.semantic_identifier)).toBeInTheDocument();
  });

  it('upgrades to the full Navigator card once the ES lookup resolves', () => {
    useCatalogueDoc.mockReturnValue({
      result: { found: true, uid: 'https://example.com/france-nas' },
      loading: false,
    });
    render(<InlineDocCard title={doc.semantic_identifier} documents={[doc]} />);
    expect(screen.getByTestId('navigator-card')).toBeInTheDocument();
    expect(useCatalogueDoc).toHaveBeenCalledWith(doc.link);
  });

  it('calls the lookup with the document link (or undefined) from the card', () => {
    useCatalogueDoc.mockReturnValue({ result: null, loading: true });
    render(<InlineDocCard title="No Match" documents={[]} />);
    expect(useCatalogueDoc).toHaveBeenCalledWith(undefined);
  });
});

describe('CcaDocCard', () => {
  it('matches the marker against the owning message documents via context', () => {
    render(
      <ChatMessageContext.Provider value={{ documents: [doc] }}>
        <CcaDocCard title={doc.semantic_identifier} />
      </ChatMessageContext.Provider>,
    );
    expect(screen.getByText('The French NAS.')).toBeInTheDocument();
  });

  it('falls back to the basic card when the message context is absent', () => {
    render(<CcaDocCard title={doc.semantic_identifier} />);
    expect(screen.getByText(doc.semantic_identifier)).toBeInTheDocument();
    expect(screen.queryByText('The French NAS.')).not.toBeInTheDocument();
  });

  it('falls back to the basic card when the message has no documents', () => {
    render(
      <ChatMessageContext.Provider value={{ documents: [] }}>
        <CcaDocCard title={doc.semantic_identifier} />
      </ChatMessageContext.Provider>,
    );
    expect(screen.queryByText('The French NAS.')).not.toBeInTheDocument();
  });
});
