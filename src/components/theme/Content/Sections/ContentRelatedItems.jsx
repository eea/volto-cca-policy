import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';

const ContentRelatedItems = (props) => {
  const { content } = props;
  const { relatedItems } = content;

  let contentRelatedItems = [];
  if (relatedItems && relatedItems?.length > 0) {
    contentRelatedItems = relatedItems.filter((item) =>
      item['@type'].includes('eea.climateadapt'),
    );
  }

  return contentRelatedItems.length > 0 ? (
    <>
      <h5>
        <FormattedMessage
          id="Related content:"
          defaultMessage="Related content:"
        />
      </h5>

      {contentRelatedItems.map((item) => (
        <Fragment key={item['@id']}>
          <UniversalLink item={item}>{item.title}</UniversalLink>
          <br />
        </Fragment>
      ))}
    </>
  ) : null;
};

export default ContentRelatedItems;
