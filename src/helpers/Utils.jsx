export const HTMLField = ({ value, className }) => {
  if (value === null) {
    return <></>;
  }

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
      <i aria-hidden="true" className="ri-external-link-line" />
      {text}
    </a>
  );
};

export const LinksList = (props) => {
  let { title, value } = props;

  return (
    <>
      <h5>{title}</h5>
      <ul>
        {value.map((url, index) => (
          <li key={index}>
            <ExternalLink url={url} text={url} />
          </li>
        ))}
      </ul>
    </>
  );
};

export const PublishedModifiedInfo = (props) => {
  const { content } = props;

  const cca_modif = content.cca_last_modified;
  const cca_publ = content.cca_published;

  let published = null;
  let modified = null;
  const dateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  if (cca_modif !== undefined) {
    modified = new Date(cca_modif).toLocaleString('default', dateFormatOptions);
  } else {
    modified = new Date(content.modification_date).toLocaleString(
      'default',
      dateFormatOptions,
    );
  }
  if (cca_publ !== undefined) {
    published = new Date(cca_publ).toLocaleString('default', dateFormatOptions);
  } else {
    published = new Date(content.publication_date).toLocaleString(
      'default',
      dateFormatOptions,
    );
  }

  // TODO fix wrong information for some cases. Test for each content type.
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
