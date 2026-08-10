import TextField from './TextField';

const VocabularyField = ({ label, values, asList }) => {
  const items = values
    ?.map((value) => value?.title || value?.token || value)
    .filter(Boolean);

  if (!items?.length) return null;

  if (asList) {
    return (
      <>
        <h5>{label}</h5>
        <ul>
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </>
    );
  }

  return <TextField label={label} value={items.join(', ')} />;
};

export default VocabularyField;
