import React from 'react';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import Schema from './schema';
import View from './CollectionStatsView';
import TransparentOverlay from '../../TransparentOverlay';

const Edit = (props) => {
  const schema = Schema(props.data);
  return (
    <>
      <TransparentOverlay>
        <View {...props} mode="edit" />
      </TransparentOverlay>

      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;
