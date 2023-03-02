import React from 'react';
import {
  HTMLField,
  ContentMetadata,
  LinksList,
  PublishedModifiedInfo,
  ShareInfo,
} from '@eeacms/volto-cca-policy/helpers';
import { Grid } from 'semantic-ui-react';

function ProjectView(props) {
  const { content } = props;
  return (
    <div className="project-view">
      <div className="ui container">
        <Grid columns="12">
          <div className="row">
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={9}
              className="col-left"
            >
              <div className="ui label">Project</div>
              <h1>
                {content.title} ({content.acronym})
              </h1>
              <h4>Description:</h4>
              <HTMLField
                value={content.long_description}
                className="long_description"
              />
              <hr />
              <h4>Project information</h4>
              <h5>Lead</h5>
              <p>{content.lead}</p>
              <h5>Partners</h5>
              <HTMLField value={content.partners} className="partners" />
              {content.funding && (
                <>
                  <h5>Source of funding</h5>
                  <p>{content.funding}</p>
                </>
              )}

              <h4>Reference information</h4>

              {content?.websites?.length > 0 && (
                <LinksList title="Websites:" value={content.websites} />
              )}

              <PublishedModifiedInfo {...props} />
              <ShareInfo {...props} />
            </Grid.Column>
            <Grid.Column
              mobile={12}
              tablet={12}
              computer={3}
              className="col-right"
            >
              <div style={{}}>
                <ContentMetadata {...props} />
              </div>
            </Grid.Column>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default ProjectView;
