import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { ChatWindow } from '@eeacms/volto-eea-chatbot/ChatBlock/chat';
import { remarkCcaDocCards } from './docCards';
import { remarkCcaNextSteps } from './nextSteps';
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

  it('plugs the doc-card and next-steps remark plugins and components', () => {
    render(<CatalogueChatView persona={{}} />);
    const { extraRemarkPlugins, extraMarkdownComponents } =
      ChatWindow.mock.calls[0][0];
    expect(extraRemarkPlugins).toEqual([remarkCcaDocCards, remarkCcaNextSteps]);
    expect(typeof extraMarkdownComponents['cca-doc-card']).toBe('function');
    expect(typeof extraMarkdownComponents['cca-suggested-next-steps']).toBe(
      'function',
    );
  });

  it('keeps the extraMarkdownComponents and extraRemarkPlugins identity stable across renders', () => {
    const { rerender } = render(<CatalogueChatView persona={{}} />);
    const firstMd = ChatWindow.mock.calls[0][0].extraMarkdownComponents;
    const firstPlugins = ChatWindow.mock.calls[0][0].extraRemarkPlugins;
    rerender(<CatalogueChatView persona={{}} />);
    const secondMd = ChatWindow.mock.calls[1][0].extraMarkdownComponents;
    const secondPlugins = ChatWindow.mock.calls[1][0].extraRemarkPlugins;
    expect(secondMd).toBe(firstMd);
    expect(secondPlugins).toBe(firstPlugins);
  });
});
