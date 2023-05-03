import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getVocabulary } from '@plone/volto/actions';
import { SidebarPortal } from '@plone/volto/components';
import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import { BIOREGIONS, OTHER_REGIONS } from '@eeacms/volto-cca-policy/helpers';
import FilterSchema from './schema';
import FilterAceContentView from './FilterAceContentView';

const REGIONS = 'eea.climateadapt.regions';

const getMacroRegions = (regions, bioregions) => {
  const macro_regions = [
    {
      label: OTHER_REGIONS,
      value: OTHER_REGIONS,
    },
  ];
  regions.forEach((region) => {
    Object.entries(bioregions).forEach(([k, v]) => {
      if (region.label === v) {
        macro_regions.push({
          label: region.label,
          value: k,
        });
      }
    });
  });

  return macro_regions;
};

export default function RelevantAceContentEdit(props) {
  const { block, data, onChangeBlock, selected, id } = props;
  const dispatch = useDispatch();

  const regionsVocabItems = useSelector((state) =>
    state.vocabularies[REGIONS]?.loaded
      ? state.vocabularies[REGIONS].items
      : [],
  );

  React.useEffect(() => {
    const action = getVocabulary({
      vocabNameOrURL: REGIONS,
    });
    dispatch(action);
  }, [dispatch]);

  const macro_regions = getMacroRegions(regionsVocabItems, BIOREGIONS);
  const schema = FilterSchema(data, macro_regions);

  return (
    <div>
      <FilterAceContentView data={data} id={id} mode="edit" />
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
