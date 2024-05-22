import React from 'react';

import { BlockDataForm, SidebarPortal } from '@plone/volto/components';

import ASTNavigationView from './ASTNavigationView';
import schema from './schema';

export default function ASTNavigationEdit(props) {
  const { block, data, onChangeBlock, selected, id } = props;

  return (
    <div>
      <ASTNavigationView data={data} id={id} mode="edit" />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          title={schema.title}
          schema={schema}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          onChangeBlock={onChangeBlock}
          formData={data}
        />
      </SidebarPortal>
    </div>
  );
}
