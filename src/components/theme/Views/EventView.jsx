import React from 'react';
import {
  BannerTitle,
  PortalMessage,
  TranslationDisclaimer,
} from '@eeacms/volto-cca-policy/components';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import { Grid } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

function CcaEventView(props) {
  const { content } = props;

  return (
    <div className="cca-event-view">
      <BannerTitle content={content} />
      <TranslationDisclaimer />

      <div className="ui container">
        <PortalMessage content={content} />
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <RenderBlocks {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
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
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default CcaEventView;
