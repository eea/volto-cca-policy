import React from 'react';

import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';

import schema from './schema';
import RelevantAceContentView from './RelevantAceContentView';

export default function RelevantAceContentEdit(props) {
  const { block, data, onChangeBlock, selected, id } = props;

  const { items = [] } = data;
  const [refresh, forceRefresh] = React.useState(0);

  React.useEffect(() => {
    items.forEach((item, index) => {
      if (item.source?.length && !item.item_title) {
        item.item_title = item.source[0].title;
        item.link = item.source['@id'];
        forceRefresh(refresh + 1);
      }
    });
  }, [items, refresh]);

  return (
    <div>
      <RelevantAceContentView data={data} id={id} mode="edit" />
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
