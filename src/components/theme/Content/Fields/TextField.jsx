const TextField = ({ label, value }) => {
  if (value === null || value === undefined || value === '') return null;

  return (
    <>
      <h5>{label}</h5>
      <p>{value}</p>
    </>
  );
};

export default TextField;
