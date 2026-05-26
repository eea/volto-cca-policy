import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Confirm, Dimmer, Loader, Table } from 'semantic-ui-react';

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

const WorkflowLinkIntegrityModal = (props) => {
  const { open, onCancel, onOk } = props;
  const intl = useIntl();
  const linkintegrityInfo = useSelector((state) => state.linkIntegrity?.result);
  const loading = useSelector((state) => state.linkIntegrity?.loading);

  const [brokenReferences, setBrokenReferences] = useState(0);
  const [breaches, setBreaches] = useState([]);

  useEffect(() => {
    if (linkintegrityInfo) {
      const breaches = linkintegrityInfo.flatMap((result) =>
        result.breaches.map((source) => ({
          source: source,
          target: result,
        })),
      );
      const source_by_uid = breaches.reduce(
        (acc, value) => acc.set(value.source.uid, value.source),
        new Map(),
      );
      const by_source = breaches.reduce((acc, value) => {
        if (acc.get(value.source.uid) === undefined) {
          acc.set(value.source.uid, new Set());
        }
        acc.get(value.source.uid).add(value.target);
        return acc;
      }, new Map());

      setBrokenReferences(by_source.size);
      setBreaches(
        Array.from(by_source, (entry) => ({
          source: source_by_uid.get(entry[0]),
          targets: Array.from(entry[1]),
        })),
      );
    } else {
      setBrokenReferences(0);
      setBreaches([]);
    }
  }, [linkintegrityInfo]);

  const showModal = open && (loading || brokenReferences > 0);

  return (
    showModal && (
      <Confirm
        open={showModal}
        confirmButton={{
          content: intl.formatMessage(messages.confirmAction),
          disabled: loading,
        }}
        cancelButton={intl.formatMessage(messages.cancel)}
        header={intl.formatMessage(messages.confirmHeader)}
        content={
          <div className="content" style={{ minHeight: loading ? '100px' : 'auto' }}>
            <Dimmer active={loading} inverted>
              <Loader indeterminate size="massive">
                {intl.formatMessage(messages.loading)}
              </Loader>
            </Dimmer>
            {!loading && brokenReferences > 0 && (
              <>
                <FormattedMessage
                  id="Changing the state of this item will break {brokenReferences} {variation} to it."
                  defaultMessage="Changing the state of this item will break {brokenReferences} {variation} to it."
                  values={{
                    brokenReferences: <span>{brokenReferences}</span>,
                    variation: (
                      <span>
                        {brokenReferences === 1 ? (
                          <FormattedMessage
                            id="reference"
                            defaultMessage="reference"
                          />
                        ) : (
                          <FormattedMessage
                            id="references"
                            defaultMessage="references"
                          />
                        )}
                      </span>
                    ),
                  }}
                />
                <BrokenLinksList intl={intl} breaches={breaches} />
              </>
            )}
          </div>
        }
        onCancel={onCancel}
        onConfirm={onOk}
        size="small"
      />
    )
  );
};

const BrokenLinksList = ({ intl, breaches }) => {
  return (
    <div className="broken-links-list" style={{ marginTop: '20px' }}>
      <FormattedMessage
        id="These items will have broken links"
        defaultMessage="These items will have broken links"
      />
      :
      <Table compact>
        <Table.Body>
          {breaches.map((breach) => (
            <Table.Row key={breach.source['@id']} verticalAlign="top">
              <Table.Cell>
                <Link
                  to={flattenToAppURL(breach.source['@id'])}
                  title={intl.formatMessage(messages.navigate_to_this_item)}
                >
                  {breach.source.title}
                </Link>
              </Table.Cell>
              <Table.Cell style={{ minWidth: '140px' }}>
                <FormattedMessage id="refers to" defaultMessage="refers to" />:
              </Table.Cell>
              <Table.Cell>
                <ul style={{ margin: 0 }}>
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
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

WorkflowLinkIntegrityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default WorkflowLinkIntegrityModal;
