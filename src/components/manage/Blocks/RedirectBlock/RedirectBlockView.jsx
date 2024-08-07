import { UniversalLink } from '@plone/volto/components';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';

export function RedirectBlockDetails({ data, token }) {
  return token ? (
    <div className="redirect-block">
      <h5>Redirection block</h5>
      <p className="discreet">
        Anonymous users will be automatically redirected to this target:
        {data?.href?.length > 0 && (
          <UniversalLink item={data.href[0]}>
            {flattenToAppURL(data.href[0]['title'])}
          </UniversalLink>
        )}
      </p>
    </div>
  ) : null;
}

export default function RedirectBlockView({ data, token }) {
  const target = data?.href?.[0]?.['@id'];
  const history = useHistory();

  React.useEffect(() => {
    if (!token) {
      history.push(flattenToAppURL(target));
    }
  }, [token, target, history]);

  return <RedirectBlockDetails data={data} token={token} />;
}
