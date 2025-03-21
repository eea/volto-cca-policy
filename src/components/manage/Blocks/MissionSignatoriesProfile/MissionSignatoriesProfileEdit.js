import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import MissionSignatoriesProfile from './MissionSignatoriesProfileView';
import schema from './schema';

export default function Edit(props) {
  const { block, data, onChangeBlock, selected } = props;
  return (
    <>
      <MissionSignatoriesProfile {...props} mode="edit" />
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
}
