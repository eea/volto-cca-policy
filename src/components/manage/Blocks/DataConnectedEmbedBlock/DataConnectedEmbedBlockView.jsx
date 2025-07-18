import { injectIntl } from 'react-intl';
import { ViewEmbedBlock } from '@eeacms/volto-datablocks/components/manage/Blocks/DataConnectedEmbedBlock/View';
import { connect } from 'react-redux';
import { getConnectedDataParametersForContext } from '@eeacms/volto-datablocks/helpers';

const ConnectedEmbedBlockView = connect((state, props) => {
  const pathname = state.router?.location?.pathname;
  const lang = (pathname || '').split('/')[1];
  const data_params = {
    ...state?.connected_data_parameters,
    byContextPath: {
      ...state?.connected_data_parameters?.byContextPath,
      [pathname]: [{ i: 'lang', v: [lang] }],
    },
  };

  const params = getConnectedDataParametersForContext(data_params, pathname);
  return {
    connected_data_parameters: params,
  };
}, {})(injectIntl(ViewEmbedBlock));

export default ConnectedEmbedBlockView;
