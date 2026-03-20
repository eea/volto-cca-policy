import React from 'react';
import { Card as UiCard } from 'semantic-ui-react';
import { ConditionalLink } from '@plone/volto/components';

const CardTitle = (props) => {
  const { item, isEditMode, itemModel } = props;
  const { title, Title } = item;
  const t = title || Title;

  return t && !itemModel?.titleOnImage ? (
    <UiCard.Header>
      <ConditionalLink
        className="header-link"
        item={item}
        condition={!isEditMode && itemModel?.hasLink}
      >
        {t}
      </ConditionalLink>
    </UiCard.Header>
  ) : null;
};

export default CardTitle;
