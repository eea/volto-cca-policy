export default function RelevantAceContentView(props) {
  const { data } = props;
  // const results = data._v_results || [];

  return (
    <div className="relevant-acecontent-block">
      Relevant acecontent view
      {data.title && <h4>{data.title}</h4>}
    </div>
  );
}
