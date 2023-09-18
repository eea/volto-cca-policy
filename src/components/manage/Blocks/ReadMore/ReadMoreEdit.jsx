import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import ReadMoreView from './ReadMoreView';
import schema from './schema';

const ReadMoreEdit = (props) => {
  const { block, data, onChangeBlock, selected, id } = props;

  return (
    <>
      <ReadMoreView data={data} id={id} mode="edit" />

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
    </>
  );
};
export default ReadMoreEdit;
