import React from 'react';
import {
  BannerTitle,
  PortalMessage,
  TranslationDisclaimer,
} from '@eeacms/volto-cca-policy/components';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import { Grid, Container } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { SubjectTags } from '@eeacms/volto-cca-policy/helpers';

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
            <Grid.Column mobile={12} tablet={12} computer={9}>
              <RenderBlocks {...props} />
              <SubjectTags {...props} />
            </Grid.Column>
            <Grid.Column mobile={12} tablet={12} computer={3}>
              <h3>
                <FormattedMessage id="When" defaultMessage="When" />
              </h3>
              <When
                start={content.start}
                end={content.end}
                whole_day={content.whole_day}
                open_end={content.open_end}
              />
              {content?.location !== null && (
                <>
                  <h3>
                    <FormattedMessage id="Where" defaultMessage="Where" />
                  </h3>
                  <p>{content.location}</p>
                </>
              )}
              {!!content.contact_email && (
                <>
                  <h3>
                    <FormattedMessage id="Info" defaultMessage="Info" />
                  </h3>
                  <p>{content.contact_email}</p>
                </>
              )}
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
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

export default CcaEventView;
