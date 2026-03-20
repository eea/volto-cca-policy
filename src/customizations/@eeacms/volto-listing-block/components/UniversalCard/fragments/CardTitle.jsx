import React from 'react';
import { Card as UiCard } from 'semantic-ui-react';
import { ConditionalLink } from '@plone/volto/components';

const getItemHref = (item) =>
  item?.linkHref || item?.linkWithHash || item?.['@id'];

const CardTitle = (props) => {
  const { item, isEditMode, itemModel } = props;
  const { title, Title } = item;
  const t = title || Title;

  const href = getItemHref(item);

  return t && !itemModel?.titleOnImage ? (
    <UiCard.Header>
      <ConditionalLink
        className="header-link"
        to={href}
        condition={!isEditMode && itemModel?.hasLink && !!href}
      >
        {t}
      </ConditionalLink>
    </UiCard.Header>
  ) : null;
};

export default CardTitle;
