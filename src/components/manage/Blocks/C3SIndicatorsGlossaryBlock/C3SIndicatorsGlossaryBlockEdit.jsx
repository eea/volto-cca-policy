import React from 'react';

import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';

import C3SIndicatorsGlossaryBlockView from './C3SIndicatorsGlossaryBlockView';
import schema from './schema';

export default function C3SIndicatorsGlossaryBlockEdit(props) {
  const { block, data, onChangeBlock, selected, id } = props;

  return (
    <div>
      <C3SIndicatorsGlossaryBlockView data={data} id={id} mode="edit" />
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
