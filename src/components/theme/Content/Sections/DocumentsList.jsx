import { defineMessages, useIntl } from 'react-intl';
import { List, ListItem, Segment } from 'semantic-ui-react';
import {
  CASE_STUDY,
  ORGANISATION,
  PUBLICATION_REPORT,
} from '@eeacms/volto-cca-policy/constants';

const messages = defineMessages({
  documents: {
    id: 'Documents',
    defaultMessage: 'Documents',
  },
  caseStudiesDocuments: {
    id: 'Case Studies Documents',
    defaultMessage: 'Case Studies Documents',
  },
  publicationsAndReportsDocuments: {
    id: 'Publications and Reports Documents',
    defaultMessage: 'Publications and Reports Documents',
  },
  organisationDocuments: {
    id: 'Organisation Documents',
    defaultMessage: 'Organisation Documents',
  },
});

const DocumentsList = (props) => {
  const { content } = props;
  const type = content['@type'];
  const files = content?.cca_files;
  const intl = useIntl();

  if (!files || files.length === 0) {
    return null;
  }
  if (!content.hasOwnProperty('show_counter')) {
    content.show_counter = true;
  }

  let section_title = intl.formatMessage(messages.documents);

  if (content['section_title']) {
    section_title = content['section_title'];
  }

  if (type === CASE_STUDY) {
    section_title = intl.formatMessage(messages.caseStudiesDocuments);
  }

  if (type === PUBLICATION_REPORT) {
    section_title = intl.formatMessage(
      messages.publicationsAndReportsDocuments,
    );
  }

  if (type === ORGANISATION) {
    section_title = intl.formatMessage(messages.organisationDocuments);
  }

  return (
    <Segment>
      <h5>
        {section_title} {content.show_counter && <>({files.length})</>}
      </h5>
      <List className="documents-list">
        {files.map((file) => (
          <ListItem key={file.url}>
            <a href={file.url} className="document-list-item">
              <i className="file alternate icon"></i>
              <span>{file.title}</span>
            </a>
          </ListItem>
        ))}
      </List>
    </Segment>
  );
};

export default DocumentsList;
