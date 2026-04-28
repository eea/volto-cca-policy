import React from 'react';
import { connect } from 'react-redux';
import { Plug } from '@plone/volto/components/manage/Pluggable';
import { Modal, Button, Form, Message } from 'semantic-ui-react';
import superagent from 'superagent';
import { flattenToAppURL, expandToBackendURL } from '@plone/volto/helpers';
import { INDICATOR } from '@eeacms/volto-cca-policy/constants';

function CreateArchivedCopyButton(props) {
  const { content, token } = props;
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [id, setId] = React.useState('');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const contentId = content?.['@id'] || '';
  const contentType = content?.['@type'];
  const reviewState = content?.review_state;
  const originalId = content?.id;

  const show =
    !!token && contentType === INDICATOR && reviewState === 'published';

  const handleOpen = () => {
    setTitle(content?.title ? `${content.title} (Archived)` : '');
    setId(originalId ? `${originalId}-v2` : '');
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!id || id === originalId) {
      setError('You must change the ID of the archived copy.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = expandToBackendURL(contentId);
      const response = await superagent
        .post(`${url}/@create-archived-copy`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({ title, id });

      const newUrl = flattenToAppURL(response.body['@id']);
      window.location.href = newUrl;
    } catch (err) {
      const message =
        err.response?.body?.message ||
        err.response?.text ||
        err.message ||
        'An error occurred while creating the archived copy.';
      setError(message);
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <Plug
        pluggable="main.toolbar.top"
        id="create-archived-copy"
        order={5}
        dependencies={[contentId]}
      >
        <button
          className="circle-right-btn"
          id="create-archived-copy-btn"
          onClick={handleOpen}
          title="Create an archived copy"
        >
          AC
        </button>
      </Plug>

      <Modal size="small" open={open} onClose={handleClose} closeIcon>
        <Modal.Header>Create an archived copy</Modal.Header>
        <Modal.Content>
          {error && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <p>{error}</p>
            </Message>
          )}
          <Form>
            <Form.Field>
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of the archived copy"
              />
            </Form.Field>
            <Form.Field>
              <label>ID</label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="ID of the archived copy"
              />
              {id === originalId && (
                <small style={{ color: '#db2828' }}>
                  The ID must be different from the original indicator.
                </small>
              )}
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            primary
            onClick={handleSubmit}
            loading={loading}
            disabled={!id || id === originalId}
          >
            Create
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default connect((state) => ({
  content: state.content.data,
  token: state.userSession.token,
}))(CreateArchivedCopyButton);
