import React from 'react';
import {
  HTMLField,
  BannerTitle,
  MetadataItemList,
} from '@eeacms/volto-cca-policy/helpers';
import { Container, Grid, Image, Segment, List } from 'semantic-ui-react';
import {
  PortalMessage,
  MissionDisclaimer,
} from '@eeacms/volto-cca-policy/components';

function MissionToolView(props) {
  const { content } = props;

  return (
    <div className="mission-item-view">
      <BannerTitle
        content={{ ...content, image: '' }}
        data={{
          info: [{ description: '' }],
          hideContentType: true,
          hideCreationDate: false,
          hideModificationDate: false,
          hidePublishingDate: false,
          hideDownloadButton: false,
          hideShareButton: false,
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
              {!!content.objective && (
                <>
                  <h2>Objective(s)</h2>
                  <HTMLField value={content.objective} />
                </>
              )}

              {!!content.short_description && (
                <>
                  <h2>Short description</h2>
                  <HTMLField value={content.short_description} />
                </>
              )}

              {!!content.free_keywords && (
                <>
                  <h2>Free keywords</h2>
                  <HTMLField value={content.free_keywords} />
                </>
              )}

              {!!content.readiness_for_use &&
                content.readiness_for_use.length > 0 && (
                  <>
                    <h2>Readiness for use</h2>

                    <MetadataItemList value={content.readiness_for_use} />
                  </>
                )}

              {!!content.applications && (
                <>
                  <h2>Applications</h2>
                  <HTMLField value={content.applications} />
                </>
              )}

              {!!content.strengths_weaknesses && (
                <>
                  <h2>
                    Strengths and weaknesses, comparative added value to other
                    similar tools
                  </h2>
                  <HTMLField value={content.strengths_weaknesses} />
                </>
              )}

              {!!content.input && (
                <>
                  <h2>Input(s)</h2>
                  <HTMLField value={content.input} />
                </>
              )}

              {!!content.output && (
                <>
                  <h3>Output(s)</h3>
                  <HTMLField value={content.output} />
                </>
              )}

              {!!content.output_image && (
                <Image
                  src={content.output_image?.scales?.large?.download}
                  alt={content.title}
                  style={{ margin: '2.5em 0' }}
                />
              )}

              {!!content.replicability && (
                <>
                  <h2>Replicability: Cost/effort for (new) usage</h2>
                  <HTMLField value={content.replicability} />
                </>
              )}

              {!!content.materials && (
                <>
                  <h2>Materials or other support available</h2>
                  <HTMLField value={content.materials} />
                </>
              )}

              {!!content.website && (
                <>
                  <h2>Website and maintenance</h2>
                  <HTMLField value={content.website} />
                </>
              )}

              {!!content.contact && (
                <>
                  <h2>Contact</h2>
                  <HTMLField value={content.contact} />
                </>
              )}

              {!!content.associated_project && (
                <>
                  <h2>Associated project(s)</h2>
                  <HTMLField value={content.associated_project} />
                </>
              )}
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={4}
              className="col-right"
            >
              <Segment className="metadata">
                {!!content.rast_steps && content.rast_steps.length > 0 && (
                  <>
                    <h5>RAST step(s) of relevance:</h5>
                    <List>
                      {content.rast_steps.map((step, index) => (
                        <List.Item key={index}>{step.title}</List.Item>
                      ))}
                    </List>
                  </>
                )}

                {!!content.geographical_scale &&
                  content.geographical_scale.length > 0 && (
                    <>
                      <h5>Geographical scale:</h5>
                      <MetadataItemList value={content.geographical_scale} />
                    </>
                  )}

                {!!content.geographical_area && (
                  <>
                    <h5>Geographical area:</h5>
                    <HTMLField value={content.geographical_area} />
                  </>
                )}

                {!!content.climate_impacts &&
                  content.climate_impacts.length > 0 && (
                    <>
                      <h5>Climate impacts:</h5>
                      <MetadataItemList value={content.climate_impacts} />
                    </>
                  )}

                {!!content.tool_language && content.tool_language.length > 0 && (
                  <>
                    <h5>Language(s) of the tool:</h5>
                    <MetadataItemList value={content.tool_language} />
                  </>
                )}

                {!!content.sectors && content.sectors.length > 0 && (
                  <>
                    <h5>Adaptation sectors:</h5>
                    <MetadataItemList value={content.sectors} />
                  </>
                )}

                {!!content.most_useful_for &&
                  content.most_useful_for.length > 0 && (
                    <>
                      <h5>Most useful for:</h5>
                      <MetadataItemList value={content.most_useful_for} />
                    </>
                  )}

                {!!content.user_requirements &&
                  content.user_requirements.length > 0 && (
                    <>
                      <h5>User requirements:</h5>
                      <MetadataItemList value={content.user_requirements} />
                    </>
                  )}
              </Segment>
            </Grid.Column>
          </div>
        </Grid>

        <MissionDisclaimer />
      </Container>
    </div>
  );
}

export default MissionToolView;
