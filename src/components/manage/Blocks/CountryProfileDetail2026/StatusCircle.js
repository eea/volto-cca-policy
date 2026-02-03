import CircleGray from './circle-gray.svg';
import CircleGreen from './circle-green.svg';
import CirclePurple from './circle-purple.svg';
import CircleRed from './circle-red.svg';

export default function StatusCircle(props) {
  const statusValue = props.statusValue;
  const statusPrint = statusValue
    ? statusValue.charAt(0).toUpperCase() + statusValue.slice(1)
    : '';
  let statusIcon = '';
  switch (statusValue.toLowerCase()) {
    case 'adopted':
      statusIcon = CircleGreen;
      break;
    case 'established':
      statusIcon = CirclePurple;
      break;
    case 'What':
      statusIcon = CircleRed;
      break;
    default:
      statusIcon = CircleGray;
  }
  return (
    <>
      <img
        src={statusIcon}
        alt="Status"
        style={{ width: '24px', height: '24px' }}
      />
      &nbsp;
      {statusPrint}
    </>
  );
}
