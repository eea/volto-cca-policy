export const HTMLField = ({ value, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: value.data }}
    ></div>
  );
};
