import React from 'react';
import {
  BannerTitle,
  PortalMessage,
  TranslationDisclaimer,
} from '@eeacms/volto-cca-policy/components';
import { Container } from 'semantic-ui-react';
import { SubjectTags } from '@eeacms/volto-cca-policy/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
// import { When } from '@plone/volto/components/theme/View/EventDatesInfo';

// const Date = (props) => {
//   const date = props.content?.effective;
//   return date ? (
//     <>
//       <When start={date} end={date} whole_day={true} open_end={false} />
//     </>
//   ) : null;
// };

function NewsItemView(props) {
  const { content } = props;

  return (
    <div className="cca-newsitem-view">
      <BannerTitle content={content} />
      <TranslationDisclaimer />

      <Container>
        <PortalMessage content={content} />
        <RenderBlocks {...props} />
        {/* <Date {...props} /> */}
        <SubjectTags {...props} />
      </Container>
    </div>
  );
}

export default NewsItemView;
