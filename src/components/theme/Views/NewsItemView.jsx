// import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import React from 'react';
import { HTMLField } from '@eeacms/volto-cca-policy/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { Label } from 'semantic-ui-react';
import { BannerTitle } from '@eeacms/volto-cca-policy/components';

// const Date = (props) => {
//   const date = props.content?.effective;
//   return date ? (
//     <>
//       <When start={date} end={date} whole_day={true} open_end={false} />
//     </>
//   ) : null;
// };

const SubjectTags = (props) => {
  const tags = props.content?.subjects;
  return tags?.length > 0 ? (
    <>
      Filed under:{' '}
      {tags.map((tag) => (
        <Label key={tag}>{tag}</Label>
      ))}
    </>
  ) : null;
};

function CcaEventView(props) {
  const { content } = props;

  return (
    <div className="cca-newsitem-view">
      <BannerTitle content={content} />
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
