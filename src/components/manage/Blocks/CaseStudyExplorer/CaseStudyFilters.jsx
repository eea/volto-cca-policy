import { useIntl, FormattedMessage } from 'react-intl';

export default function CaseStudyFilters(props) {
  const { filters, activeFilters, setActiveFilters } = props;
  const intl = useIntl();
  return (
    <>
      <h4>
        <FormattedMessage
          id="Adaptation sectors"
          defaultMessage="Adaptation sectors"
        />
      </h4>
      {Object.entries(filters?.sectors || {}).map(([value, label], index) => (
        <p key={index}>
          <span>{intl.formatMessage({ id: label })}</span>
          <input
            value={value}
            type="checkbox"
            onChange={(e) => {
              // const value =
              const temp = JSON.parse(JSON.stringify(activeFilters));
              if (e.target.checked) {
                temp.sectors.push(e.target.value);
              } else {
                temp.sectors = temp.sectors.filter((value) => {
                  if (value !== e.target.value) return value;
                  return null;
                });
              }
              setActiveFilters(temp);
            }}
          />
        </p>
      ))}
      <h4>
        <FormattedMessage
          id="Climate impacts"
          defaultMessage="Climate impacts"
        />
      </h4>
      {Object.entries(filters?.impacts || {}).map(([value, label], index) => (
        <p key={index}>
          <span>{intl.formatMessage({ id: label })}</span>
          <input
            value={value}
            type="checkbox"
            onChange={(e) => {
              // const value =
              const temp = JSON.parse(JSON.stringify(activeFilters));
              if (e.target.checked) {
                temp.impacts.push(e.target.value);
              } else {
                temp.impacts = temp.impacts.filter((value) => {
                  if (value !== e.target.value) return value;
                  return null;
                });
              }
              setActiveFilters(temp);
            }}
          />
        </p>
      ))}
    </>
  );
}
