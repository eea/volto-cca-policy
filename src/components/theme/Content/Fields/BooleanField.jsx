import TextField from './TextField';

const BooleanField = ({ label, value, yesLabel, noLabel }) => (
  <TextField label={label} value={value ? yesLabel : noLabel} />
);

export default BooleanField;
