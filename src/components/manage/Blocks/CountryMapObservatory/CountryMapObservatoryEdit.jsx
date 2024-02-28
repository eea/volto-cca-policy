import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import CountryMapObservatoryView from './CountryMapObservatoryOLView';
import Schema from './schema';

export default function CountryMapObservatoryEdit(props) {
  const { block, data, onChangeBlock, selected } = props;
  const schema = Schema(data);
  return (
    <>
      <CountryMapObservatoryView {...props} mode="edit" />
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
