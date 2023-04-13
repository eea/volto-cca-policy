import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

export default function SearchAceContentView(props) {
  const { data } = props;
  const results = data._v_results || [];
  const {
    blocks: { blocksConfig },
  } = config;
  const CallToActionBlockView = blocksConfig.callToActionBlock.view;

  return results && results.length > 0 ? (
    <div className="search-acecontent-block">
      {data.title && <h4>{data.title}</h4>}
      <List>
        {results.map((result, index) => (
          <List.Item key={index}>
            <Link to={flattenToAppURL(result[2])}>
              {result[0]} ({result[1]})
            </Link>
          </List.Item>
        ))}
      </List>
      <CallToActionBlockView
        data={{
          href: '/en/help/share-your-info',
          text: 'Share your information',
          target: '_self',
          styles: {
            align: 'left',
            icon: 'ri-share-line',
            inverted: false,
            rightIcon: false,
            theme: 'primary',
          },
        }}
      />
    </div>
  ) : (
    <div>No results</div>
  );
}
