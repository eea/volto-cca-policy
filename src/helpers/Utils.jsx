export const HTMLField = ({ value, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: value.data }}
    ></div>
  );
};

export const ExternalLink = (props) => {
  let { url, text } = props;

  if (text === undefined) {
    text = url;
  }

  return (
    <a href={url}>
      <i aria-hidden="true" className="icon ri-share-box-fill" />
      {text}
    </a>
  );
};

export const PublishedModifiedInfo = (props) => {
  const { content } = props;

  const dateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const published = new Date(content.publication_date).toLocaleString(
    'default',
    dateFormatOptions,
  );

  const modified = new Date(content.modification_date).toLocaleString(
    'default',
    dateFormatOptions,
  );

  return (
    <div className="published-modified-info">
      <p>
        <span>
          <strong>Published in Climate-ADAPT</strong>
          &nbsp;
          {published}
        </span>
        <span> &nbsp; - &nbsp; </span>
        <span>
          <strong>Last Modified in Climate-ADAPT</strong>
          &nbsp;
          {modified}
        </span>
      </p>
    </div>
  );
};
