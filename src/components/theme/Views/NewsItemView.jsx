import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import React from 'react';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import config from '@plone/volto/registry';
import { Label } from 'semantic-ui-react';

const Date = (props) => {
  const date = props.content?.effective;
  return date ? (
    <>
      <When start={date} end={date} whole_day={true} open_end={false} />
    </>
  ) : null;
};

const SubjectTags = (props) => {
  const tags = props.content?.subjects;
  return tags ? (
    <>
      Filed under:{' '}
      {tags.map((tag) => (
        <Label key={tag}>{tag}</Label>
      ))}
    </>
  ) : null;
};

function CcaEventView(props) {
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;
  const { content } = props;

  return (
    <div className="cca-newsitem-view">
      <TitleBlockView
        {...props}
        data={{ info: [{ description: '' }] }}
        metadata={content}
      />
      <div className="ui container">
        <p>{content.description}</p>
        <HTMLField value={content.text} className="long_description" />
        <RenderBlocks {...props} />
        {/* <Date {...props} /> */}
        <SubjectTags {...props} />
      </div>
    </div>
  );
}

export default CcaEventView;
