import React from 'react';
import axios from 'axios';

export default function C3SIndicatorsGlossaryBlockView(props) {
  const [tableHTML, setTableHTML] = React.useState('');

  const getIndicatorsData = () => {
    const url =
      '/++api++/en/knowledge/european-climate-data-explorer/@c3s_indicators_glossary_table_api';

    axios
      .get(url)
      .then((response) => {
        setTableHTML(response.data.c3s_indicators_glossary_table);
      })
      .catch((error) => {
        // console.error(error);
      });
  };

  React.useEffect(() => {
    getIndicatorsData();
  });

  return (
    <div className="block c3sindicators-glossary-block">
      <div
        className="glossary-table"
        dangerouslySetInnerHTML={{
          __html: tableHTML,
        }}
      />
    </div>
  );
}
