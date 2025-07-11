import { PrivacyProtection } from '@eeacms/volto-embed';
import {
  buildFlourishUrl,
  flourishDataprotection,
  getDataSrcFromEmbedCode,
} from '@eeacms/volto-cca-policy/helpers/flourishUtils';

import './style.less';

const FlourishEmbedBlockView = ({ data, mode }) => {
  const isEditMode = mode === 'edit';
  const embed_code = data?.embed_code || '';
  const flourishPath = getDataSrcFromEmbedCode(embed_code);
  const flourishUrl = buildFlourishUrl(flourishPath);

  if (!flourishUrl)
    return isEditMode ? <div>Paste a valid Flourish embed code.</div> : null;

  return (
    <PrivacyProtection
      data={{
        url: flourishUrl,
        dataprotection: flourishDataprotection,
      }}
    >
      <iframe
        height="980"
        width="100%"
        src={flourishUrl}
        title="Flourish visualization"
        className="flourish-embed-iframe"
        sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
    </PrivacyProtection>
  );
};

export default FlourishEmbedBlockView;
