import { HTMLField, BannerTitle } from '@eeacms/volto-cca-policy/helpers';
import { Container, Grid } from 'semantic-ui-react';
import { PortalMessage } from '@eeacms/volto-cca-policy/components';
import './styles.less';

function MissiongFundingCCAView(props) {
  const { content } = props;

  return (
    <div className="mission-funding-cca-view">
      <BannerTitle
        content={{ ...content, image: '' }}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: true,
          hideModificationDate: true,
          hidePublishingDate: true,
          hideDownloadButton: false,
          hideShareButton: false,
          subtitle: 'EU and National Funding of Climate Change Adaption',
        }}
      />

      <Container>
        <PortalMessage content={content} />
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={8}
              className="col-left"
            >
              {!!content.objective && content.objective.data.length > 7 && (
                <>
                  <h3>Objective of the funding programme</h3>
                  <HTMLField value={content.objective} />
                </>
              )}

              {!!content.funding_type && (
                <>
                  <h3>Type of funding</h3>
                  <HTMLField value={content.funding_type} />
                </>
              )}

              {!!content.budget_range && (
                <>
                  <h3>Expected budget range of proposals</h3>
                  <p>{content.budget_range}</p>
                </>
              )}

              {!!content.funding_rate && (
                <>
                  <h3>Funding rate (percentage of covered costs)</h3>
                  <p>{content.funding_rate}</p>
                </>
              )}
              <h3>
                Can the received funding be combined with other funding sources
                (blended)?
              </h3>
              <p>{content.is_blended === true ? 'Yes' : 'No'}</p>
              <h3>Is a Consortium required to apply for the funding?</h3>
              <p>{content.is_consortium_required === true ? 'Yes' : 'No'}</p>
              {!!content.authority && (
                <>
                  <h3>Administering authority</h3>
                  <p>{content.authority}</p>
                </>
              )}
              {!!content.publication_page && (
                <>
                  <h3>Publication page</h3>
                  <a href={content.publication_page}>
                    {content.publication_page}
                  </a>
                </>
              )}
              {!!content.general_info && (
                <>
                  <h3>General information</h3>
                  <a href={content.general_info}>{content.general_info}</a>
                </>
              )}
              {!!content.further_info && (
                <>
                  <h3>Further information</h3>
                  <p>{content.further_info}</p>
                </>
              )}
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <div className="metadata">
                {!!content.country && content.country.length > 0 && (
                  <>
                    <h5>Countries where the funding opportunity is offered</h5>
                    <p>
                      {content.country
                        .map((country) => country.title)
                        .join(', ')}
                    </p>
                  </>
                )}
                {!!content.regions && content.regions.length > 0 && (
                  <>
                    <h5>Region where the funding is offered</h5>
                    <p>{content.regions}</p>
                  </>
                )}
                {!!content.rast_steps && content.rast_steps.length > 0 && (
                  <>
                    <h5>RAST step(s) of relevance</h5>
                    <ul>
                      {content.rast_steps.map((step) => (
                        <li>{step.title}</li>
                      ))}
                    </ul>
                  </>
                )}
                {!!content.eligible_entities &&
                  content.eligible_entities.length > 0 && (
                    <>
                      <h5>Eligible to receive funding</h5>
                      <ul>
                        {content.eligible_entities.map((entity) => (
                          <li>{entity.title}</li>
                        ))}
                      </ul>
                    </>
                  )}
                {!!content.sectors && content.eligible_entities.length > 0 && (
                  <>
                    <h5>Adaptation Sectors</h5>
                    <ul>
                      {content.sectors.map((sector) => (
                        <li>{sector.title}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </Grid.Column>
          </div>
        </Grid>
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={12}
              className="col-full"
            >
              <div className="styled-slate has--style_name--content-box-gray styled">
                <div className="disclaimer content-box">
                  <div className="content-box-inner">
                    <p>
                      <strong>Disclaimer</strong>
                      <br />
                      The contents and links to third-party items on this
                      Mission webpage are developed by the MIP4Adapt team led by
                      Ricardo, under contract CINEA/2022/OP/0013/SI2.884597
                      funded by the European Union and do not necessarily
                      reflect those of the European Union, CINEA, or those of
                      the European Environment Agency (EEA) as host of the
                      Climate-ADAPT Platform. Neither the European Union nor
                      CINEA nor the EEA accepts responsibility or liability
                      arising out of or in connection with the information on
                      these pages.
                    </p>
                  </div>
                </div>
              </div>
            </Grid.Column>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default MissiongFundingCCAView;
