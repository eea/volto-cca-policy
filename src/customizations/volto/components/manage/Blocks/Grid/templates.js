import { defineMessages } from 'react-intl';
import { blocksFormGenerator } from '@plone/volto/helpers';

import gridTemplate1 from './grid-1.svg';
import gridTemplate2 from './grid-2.svg';
import gridTemplate3 from './grid-3.svg';
import gridTemplate4 from './grid-4.svg';
import gridTemplate5 from './grid-5.svg';
import gridTemplate6 from './grid-6.svg';

const messages = defineMessages({
  column: {
    id: 'column',
    defaultMessage: 'column',
  },
  columns: {
    id: 'columns',
    defaultMessage: 'columns',
  },
});

const templates = (type) => (intl) => [
  {
    image: gridTemplate1,
    id: 'gridtemplateone',
    title: `1 ${intl.formatMessage(messages.column)}`,
    blocksData: blocksFormGenerator(1, type),
  },
  {
    image: gridTemplate2,
    id: 'gridtemplatetwo',
    title: `2 ${intl.formatMessage(messages.columns)}`,
    blocksData: blocksFormGenerator(2, type),
  },
  {
    image: gridTemplate3,
    id: 'gridtemplatethree',
    title: `3 ${intl.formatMessage(messages.columns)}`,
    blocksData: blocksFormGenerator(3, type),
  },
  {
    image: gridTemplate4,
    id: 'gridtemplatefour',
    title: `4 ${intl.formatMessage(messages.columns)}`,
    blocksData: blocksFormGenerator(4, type),
  },
  {
    image: gridTemplate5,
    id: 'gridtemplatefive',
    title: `5 ${intl.formatMessage(messages.columns)}`,
    blocksData: blocksFormGenerator(5, type),
  },
  {
    image: gridTemplate6,
    id: 'gridtemplatesix',
    title: `6 ${intl.formatMessage(messages.columns)}`,
    blocksData: blocksFormGenerator(6, type),
  },
];

export default templates;
