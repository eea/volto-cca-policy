import React from 'react';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import schema from './schema';
import View from './View';

export default function Edit(props) {
  const { block, data, onChangeBlock, selected, id } = props;
  return (
    <div>
      <View data={data} id={id} mode="edit" />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          block={block}
          title={schema.title}
          schema={schema}
          onChangeField={(field, value) =>
            onChangeBlock(block, { ...data, [field]: value })
          }
          onChangeBlock={onChangeBlock}
          formData={data}
        />
      </SidebarPortal>
    </div>
  );
}
