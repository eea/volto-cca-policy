import { FormattedMessage } from 'react-intl';

const PublishedModifiedInfo = ({ content }) => {
  const { cca_published, publication_date } = content;

  const dateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const published = new Date(cca_published || publication_date).toLocaleString(
    'default',
    dateFormatOptions,
  );

  return published ? (
    <div className="published-info">
      <p>
        <strong>
          <FormattedMessage
            id="Published in Climate-ADAPT"
            defaultMessage="Published in Climate-ADAPT"
          />
        </strong>
        {': '}
        {published}
      </p>
    </div>
  ) : null;
};

export default PublishedModifiedInfo;
