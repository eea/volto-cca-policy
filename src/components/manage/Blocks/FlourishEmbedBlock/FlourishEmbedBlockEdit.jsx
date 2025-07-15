import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import FlourishEmbedBlockView from './FlourishEmbedBlockView';
import schema from './schema';

const FlourishEmbedBlockEdit = (props) => {
  const { block, data, onChangeBlock, selected, id } = props;

  return (
    <>
      <div className="flourish-edit-view">
        <FlourishEmbedBlockView data={data} id={id} mode="edit" />
      </div>

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
export default FlourishEmbedBlockEdit;
