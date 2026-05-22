import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { RedirectBlockDetails } from './RedirectBlockView';
import Schema from './schema';

export default function CountryMapObservatoryEdit(props) {
  const { block, data, onChangeBlock, selected } = props;
  const schema = Schema(data);

  return (
    <div className="redirection-block-edit">
      <RedirectBlockDetails data={data} token={true} />

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
