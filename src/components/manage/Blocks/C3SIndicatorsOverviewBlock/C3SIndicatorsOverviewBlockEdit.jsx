import React from 'react';

import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';

import C3SIndicatorsOverviewBlockView from './C3SIndicatorsOverviewBlockView';
import schema from './schema';

export default function C3SIndicatorsOverviewBlockEdit(props) {
  const { block, data, onChangeBlock, selected, id } = props;

  return (
    <div>
      <C3SIndicatorsOverviewBlockView data={data} id={id} mode="edit" />
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
