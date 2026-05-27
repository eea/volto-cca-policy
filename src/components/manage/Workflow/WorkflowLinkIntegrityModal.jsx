import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';

const messages = defineMessages({
  confirmHeader: {
    id: 'Warning: Potential broken links',
    defaultMessage: 'Warning: Potential broken links',
  },
  loading: {
    id: 'link-integrity: loading references',
    defaultMessage: 'Checking references...',
  },
  confirmAction: {
    id: 'link-integrity: Change state anyway',
    defaultMessage: 'Change state anyway',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  navigate_to_this_item: {
    id: 'Navigate to this item',
    defaultMessage: 'Navigate to this item',
  },
});

/**
 * Derive breach data synchronously from linkintegrityInfo.
 * No useEffect + useState — computed during render so it is always
 * in sync with the loading flag in the same render cycle.
 */
function computeBreaches(linkintegrityInfo) {
  if (!linkintegrityInfo) {
    return { brokenReferences: 0, breaches: [] };
  }

  const all = linkintegrityInfo.flatMap((result) =>
    result.breaches.map((source) => ({ source, target: result })),
  );

  const sourceByUid = new Map();
  const bySource = new Map();

  for (const entry of all) {
    sourceByUid.set(entry.source.uid, entry.source);
    if (!bySource.has(entry.source.uid)) {
      bySource.set(entry.source.uid, new Set());
    }
    bySource.get(entry.source.uid).add(entry.target);
  }

  return {
    brokenReferences: bySource.size,
    breaches: Array.from(bySource, ([uid, targets]) => ({
      source: sourceByUid.get(uid),
      targets: Array.from(targets),
    })),
  };
}

/**
 * Plain HTML overlay dialog — no semantic-ui-react, no Portal,
 * no Confirm, no Modal.  Just a fixed-position div with inline styles.
 */
const WorkflowLinkIntegrityModal = (props) => {
  const { open, onCancel, onOk } = props;
  const intl = useIntl();
  const linkintegrityInfo = useSelector((state) => state.linkIntegrity?.result);
  const loading = useSelector((state) => state.linkIntegrity?.loading);

  const { brokenReferences, breaches } = computeBreaches(linkintegrityInfo);

  // Keep visible while loading OR while breaches exist.
  // Because brokenReferences is derived synchronously, it is always
  // consistent with `loading` in the same render.
  const show = open && (loading || brokenReferences > 0);

  // Create a dedicated mount container attached to document.body so the
  // modal renders outside the toolbar dropdown's stacking context.
  // Initialized synchronously (not in useEffect) so it is available on
  // the first render — important for tests and to avoid a flicker.
  const containerRef = useRef(
    (() => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      return el;
    })(),
  );

  useEffect(() => {
    return () => {
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
    };
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }
    },
    [onCancel],
  );

  // Prevent the Toolbar's global `document mousedown` handler from closing
  // the toolbar menu while our modal is open. The Toolbar listens on
  // `document` for `mousedown` and calls `closeMenu()` if the click is
  // outside the toolbar pusher. By adding a capture-phase listener on our
  // portal root, we intercept the event before it bubbles to `document`.
  const handleMousedown = useCallback((e) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      // capture=true: fires before any bubbling listeners on ancestors
      containerRef.current.addEventListener('mousedown', handleMousedown, true);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        containerRef.current?.removeEventListener(
          'mousedown',
          handleMousedown,
          true,
        );
      };
    }
  }, [show, handleKeyDown, handleMousedown]);

  if (!show) return null;

  return createPortal(
    <>
      <div
        className="li-modal-backdrop"
        role="presentation"
        tabIndex={-1}
        onClick={onCancel}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }
        }}
        data-testid="li-modal-backdrop"
      >
        <div
          className="li-modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="li-modal-title"
          onClick={(e) => e.stopPropagation()}
          data-testid="li-modal-dialog"
        >
          <div className="li-modal-header">
            <span className="li-modal-title" id="li-modal-title">
              {intl.formatMessage(messages.confirmHeader)}
            </span>
          </div>

          <div className="li-modal-content">
            {loading && (
              <div className="li-modal-loading">
                <div className="li-spinner" />
                <span>{intl.formatMessage(messages.loading)}</span>
              </div>
            )}

            {!loading && brokenReferences > 0 && (
              <>
                <p>
                  <FormattedMessage
                    id="By changing the state, we're not breaking references, but may break user experience for final Anonymous users. There are {brokenReferences} {variation} to this item:"
                    defaultMessage="By changing the state, we're not breaking references, but may break user experience for final Anonymous users. There are {brokenReferences} {variation} to this item:"
                    values={{
                      brokenReferences: <strong>{brokenReferences}</strong>,
                      variation:
                        brokenReferences === 1 ? (
                          <FormattedMessage
                            id="reference"
                            defaultMessage="reference"
                          />
                        ) : (
                          <FormattedMessage
                            id="references"
                            defaultMessage="references"
                          />
                        ),
                    }}
                  />
                </p>
                <BrokenLinksList intl={intl} breaches={breaches} />
              </>
            )}
          </div>

          <div className="li-modal-actions">
            <button
              className="li-btn li-btn-secondary"
              onClick={onCancel}
              disabled={loading}
              data-testid="li-btn-cancel"
            >
              {intl.formatMessage(messages.cancel)}
            </button>
            <button
              className="li-btn li-btn-primary"
              onClick={onOk}
              disabled={loading}
              data-testid="li-btn-confirm"
            >
              {intl.formatMessage(messages.confirmAction)}
            </button>
          </div>
        </div>
      </div>
      <style>{modalStyles}</style>
    </>,
    containerRef.current,
  );
};

const BrokenLinksList = ({ intl, breaches }) => {
  return (
    <div className="li-broken-links-list">
      <p>
        <FormattedMessage
          id="These items will have broken links"
          defaultMessage="These items will have broken links"
        />
        :
      </p>
      <table className="li-breach-table">
        <tbody>
          {breaches.map((breach) => (
            <tr key={breach.source['@id']}>
              <td className="li-breach-source">
                <Link
                  to={flattenToAppURL(breach.source['@id'])}
                  title={intl.formatMessage(messages.navigate_to_this_item)}
                >
                  {breach.source.title}
                </Link>
              </td>
              <td className="li-breach-label">
                <FormattedMessage id="refers to" defaultMessage="refers to" />:
              </td>
              <td className="li-breach-targets">
                <ul>
                  {breach.targets.map((target) => (
                    <li key={target['@id']}>
                      <Link
                        to={flattenToAppURL(target['@id'])}
                        title={intl.formatMessage(
                          messages.navigate_to_this_item,
                        )}
                      >
                        {target.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

WorkflowLinkIntegrityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default WorkflowLinkIntegrityModal;

/**
 * Minimal inline styles — no external CSS dependency.
 * Matches Volto's general look (white dialog, centred, dark backdrop).
 */
const modalStyles = `
  .li-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
  }

  .li-modal-dialog {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .li-modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e0e0e0;
  }

  .li-modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .li-modal-content {
    padding: 20px;
    min-height: 80px;
    color: #4a4a4a;
    font-size: 14px;
    line-height: 1.5;
  }

  .li-modal-loading {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    padding: 20px 0;
  }

  .li-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #e0e0e0;
    border-top-color: #007bc1;
    border-radius: 50%;
    animation: li-spin 0.7s linear infinite;
  }

  @keyframes li-spin {
    to { transform: rotate(360deg); }
  }

  .li-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid #e0e0e0;
  }

  .li-btn {
    padding: 8px 18px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.15s, border-color 0.15s;
  }

  .li-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .li-btn-secondary {
    background: #f5f5f5;
    border-color: #d0d0d0;
    color: #333;
  }

  .li-btn-secondary:hover:not(:disabled) {
    background: #ebebeb;
  }

  .li-btn-primary {
    background: #007bc1;
    color: #fff;
  }

  .li-btn-primary:hover:not(:disabled) {
    background: #005a89;
  }

  .li-broken-links-list {
    margin-top: 16px;
  }

  .li-breach-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .li-breach-table td {
    padding: 6px 8px;
    vertical-align: top;
    border-bottom: 1px solid #eee;
  }

  .li-breach-label {
    white-space: nowrap;
    padding-left: 12px;
    color: #888;
    width: 1px;
  }

  .li-breach-targets ul {
    margin: 0;
    padding-left: 18px;
  }

  .li-breach-targets li {
    margin-bottom: 2px;
  }

  .li-breach-source a,
  .li-breach-targets a {
    color: #007bc1;
    text-decoration: none;
  }

  .li-breach-source a:hover,
  .li-breach-targets a:hover {
    text-decoration: underline;
  }
`;
