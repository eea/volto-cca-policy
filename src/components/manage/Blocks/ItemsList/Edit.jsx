import React from 'react';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import schema from './schema';
import View from './View';

const getImagePath = (value) => {
  const selected = Array.isArray(value) ? value[0] : value;
  if (!selected) return '';
  if (typeof selected === 'string') return selected;
  if (typeof selected !== 'object') return '';

  const contentUrl =
    selected['@id'] || selected.linkHref || selected.linkWithHash;
  const scaleUrl =
    selected.scales?.image?.download ||
    selected.image_scales?.image?.[0]?.download;
  if (!scaleUrl) {
    return contentUrl
      ? `${contentUrl.replace(/\/$/, '')}/@@images/image`
      : '';
  }
  if (/^(https?:|\/|data:)/i.test(scaleUrl)) return scaleUrl;
  return contentUrl
    ? `${contentUrl.replace(/\/$/, '')}/${scaleUrl.replace(/^\//, '')}`
    : `/${scaleUrl}`;
};

const persistItemIconPaths = (items) =>
  (items || []).map((item) => ({
    ...item,
    custom_icon_path: getImagePath(item.custom_icon),
    custom_hover_icon_path: getImagePath(item.custom_hover_icon),
  }));

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
          onChangeField={(field, value) => {
            const nextValue =
              field === 'items' ? persistItemIconPaths(value) : value;
            onChangeBlock(block, { ...data, [field]: nextValue });
          }}
          onChangeBlock={onChangeBlock}
          formData={data}
        />
      </SidebarPortal>
    </div>
  );
}
