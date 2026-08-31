import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { ChatWindow } from '@eeacms/volto-eea-chatbot/ChatBlock/chat';
import { remarkCcaDocCards } from './docCards';
import CatalogueChatView from './CatalogueChatView';

jest.mock('@eeacms/volto-eea-chatbot/ChatBlock/chat', () => ({
  ChatWindow: jest.fn((props) => (
    <div
      data-testid="chat-window"
      data-hide-sources-tab={String(props.hideSourcesTab)}
      data-persona={props.persona?.name || ''}
    />
  )),
}));

describe('CatalogueChatView', () => {
  beforeEach(() => {
    ChatWindow.mockClear();
  });

  it('forwards the block fields (top-level props) to the classic ChatWindow', () => {
    const { getByTestId } = render(
      <CatalogueChatView
        persona={{ name: 'Assistanta' }}
        block_id="block-1"
        assistant="57"
      />,
    );
    const chatWindow = getByTestId('chat-window');
    expect(chatWindow).toHaveAttribute('data-persona', 'Assistanta');
    expect(ChatWindow.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        persona: { name: 'Assistanta' },
        block_id: 'block-1',
        assistant: '57',
      }),
    );
  });

  it('suppresses the classic sources UI', () => {
    const { getByTestId } = render(<CatalogueChatView persona={{}} />);
    expect(getByTestId('chat-window')).toHaveAttribute(
      'data-hide-sources-tab',
      'true',
    );
  });

  it('plugs the doc-card remark plugin and the cca-doc-card component', () => {
    render(<CatalogueChatView persona={{}} />);
    const { extraRemarkPlugins, extraMarkdownComponents } =
      ChatWindow.mock.calls[0][0];
    expect(extraRemarkPlugins).toEqual([remarkCcaDocCards]);
    expect(typeof extraMarkdownComponents['cca-doc-card']).toBe('function');
  });

  it('keeps the extraMarkdownComponents identity stable across renders', () => {
    const { rerender } = render(<CatalogueChatView persona={{}} />);
    const first = ChatWindow.mock.calls[0][0].extraMarkdownComponents;
    rerender(<CatalogueChatView persona={{}} />);
    const second = ChatWindow.mock.calls[1][0].extraMarkdownComponents;
    expect(second).toBe(first);
  });
});
