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
