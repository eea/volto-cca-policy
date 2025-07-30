/**
 * HtmlSlateWidget, a slate widget variant that saves its data as HTML
 */

import React from 'react';
import { debounce } from 'lodash';
import ReactDOMServer from 'react-dom/server';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

import { FormFieldWrapper } from '@plone/volto/components';
import SlateEditor from '@plone/volto-slate/editor/SlateEditor';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import { makeEditor } from '@plone/volto-slate/utils';
import deserialize from '@plone/volto-slate/editor/deserialize';
import {
  createEmptyParagraph,
  normalizeExternalData,
} from '@plone/volto-slate/utils';
import { ErrorBoundary } from '@plone/volto-slate/widgets/ErrorBoundary';

import '@plone/volto-slate/widgets/style.css';

const messages = defineMessages({
  error: {
    id: 'An error has occurred while editing "{name}" field. We have been notified and we are looking into it. Please save your work and retry. If the issue persists please contact the site administrator.',
    defaultMessage:
      'An error has occurred while editing "{name}" field. We have been notified and we are looking into it. Please save your work and retry. If the issue persists please contact the site administrator.',
  },
});

const HtmlSlateWidget = (props) => {
  const {
    id,
    onChange,
    value,
    focus,
    className,
    block,
    placeholder,
    properties,
    intl,
  } = props;

  const [selected, setSelected] = React.useState(focus);

  const editor = React.useMemo(() => makeEditor(), []);

  const token = useSelector((state) => state.userSession.token);

  const toHtml = React.useCallback(
    (value) => {
      const mockStore = configureStore();
      const html = ReactDOMServer.renderToStaticMarkup(
        <Provider store={mockStore({ userSession: { token } })}>
          <MemoryRouter>{serializeNodes(value || [])}</MemoryRouter>
        </Provider>,
      );

      return {
        'content-type': value ? value['content-type'] : 'text/html',
        encoding: value ? value.encoding : 'utf8',
        data: html,
      };
    },
    [token],
  );

  const unwrapDivs = (element) => {
    const divs = Array.from(element.querySelectorAll('div'));

    divs.forEach((div) => {
      const parent = div.parentNode;

      while (div.firstChild) {
        const child = div.firstChild;

        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = child.textContent;
          parent.insertBefore(p, div);
          div.removeChild(child);
        } else {
          parent.insertBefore(child, div);
        }
      }

      parent.removeChild(div);
    });
  };

  const fromHtml = React.useCallback(
    (value) => {
      const html = value?.data || '';

      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const body =
        parsed.getElementsByTagName('google-sheets-html-origin').length > 0
          ? parsed.querySelector('google-sheets-html-origin > table')
          : parsed.body;

      unwrapDivs(body);

      let data = deserialize(editor, body, { collapseWhitespace: true });

      if (data.length) {
        data = normalizeExternalData(editor, data);
      } else {
        return [createEmptyParagraph()];
      }

      // editor.children = data;
      // Editor.normalize(editor);
      // TODO: need to add {text: ""} placeholders between elements
      const res = data.length ? data : [createEmptyParagraph()];
      return res;
    },
    [editor],
  );

  const lastSavedHtmlRef = React.useRef(value?.data);

  const [valueFromHtml, setValueFromHtml] = React.useState(() =>
    fromHtml(value),
  );

  React.useEffect(() => {
    if (value?.data !== lastSavedHtmlRef.current) {
      setValueFromHtml(fromHtml(value));
    }
  }, [value, fromHtml]);

  const debouncedOnChange = React.useMemo(() => {
    return debounce((newSlateValue) => {
      const htmlValue = toHtml(newSlateValue);
      lastSavedHtmlRef.current = htmlValue.data;
      onChange(id, htmlValue);
    }, 100);
  }, [id, onChange, toHtml]);

  React.useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const handleChange = React.useCallback(
    (newValue) => {
      setValueFromHtml(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange],
  );

  const handleClick = React.useCallback(() => {
    setSelected(true);
  }, []);

  return (
    <FormFieldWrapper {...props} draggable={false} className="slate_wysiwyg">
      <div
        className="slate_wysiwyg_box"
        role="textbox"
        tabIndex="-1"
        style={{ boxSizing: 'initial' }}
        onClick={handleClick}
        onKeyDown={() => {}}
      >
        <ErrorBoundary name={intl.formatMessage(messages.error, { name: id })}>
          <SlateEditor
            className={className}
            id={id}
            name={id}
            value={valueFromHtml}
            onChange={handleChange}
            block={block}
            selected={selected}
            properties={properties}
            placeholder={placeholder}
          />
        </ErrorBoundary>
      </div>
    </FormFieldWrapper>
  );
};

export default injectIntl(HtmlSlateWidget);
