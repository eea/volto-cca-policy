import React from 'react';
import {
  BannerTitle,
  PortalMessage,
  TranslationDisclaimer,
} from '@eeacms/volto-cca-policy/components';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { Grid, Container, Segment } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { SubjectTags, EventDetails } from '@eeacms/volto-cca-policy/helpers';

function CcaEventView(props) {
  const { content } = props;

  return (
    <div className="cca-event-view">
      <BannerTitle content={content} />
      <TranslationDisclaimer />

      <Container>
        <PortalMessage content={content} />
        <Grid columns="12">
          <Grid.Row>
            <Grid.Column mobile={12} tablet={12} computer={8}>
              <RenderBlocks {...props} />
              <SubjectTags {...props} />
            </Grid.Column>
            <Grid.Column mobile={12} tablet={12} computer={4}>
              <Segment>
                <EventDetails {...props} />
                {content?.event_url && (
                  <>
                    <h3>
                      <FormattedMessage id="Web" defaultMessage="Web" />
                    </h3>
                    <p>
                      <a href={content.event_url} target="_blank">
                        <FormattedMessage
                          id="Visit external website"
                          defaultMessage="Visit external website"
                        />
                      </a>
                    </p>
                  </>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default CcaEventView;
