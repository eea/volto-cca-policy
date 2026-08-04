import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, List, ListItem } from 'semantic-ui-react';
import { ACE_PROJECT, ORGANISATION } from '@eeacms/volto-cca-policy/constants';
import { makeContributionsSearchQuery } from '@eeacms/volto-cca-policy/helpers/search';
import { HTMLField } from '../ContentFields';
import LinksList from './LinksList';

const ReferenceInfo = (props) => {
  const { content } = props;
  const type = content['@type'];
  const {
    websites,
    source,
    contributor_list,
    other_contributor,
    contributions,
  } = content;
  const search_link = makeContributionsSearchQuery(content);
  const [isReadMore, setIsReadMore] = React.useState(false);
  const contributions_rest = contributions ? contributions.slice(0, 10) : [];

  return (websites && websites?.length > 0) ||
    (source && source?.data.length > 0) ||
    (contributor_list && contributor_list?.length > 0) ||
    (contributions && contributions.length > 0) ||
    (other_contributor && other_contributor?.length > 0) ? (
    <>
      <h2>
        <FormattedMessage
          id="Reference information"
          defaultMessage="Reference information"
        />
      </h2>
      {websites?.length > 0 && (
        <>
          <h5 id="websites">
            <FormattedMessage id="Websites:" defaultMessage="Websites:" />
          </h5>
          <LinksList value={websites} />
        </>
      )}
      {type !== ACE_PROJECT && type !== ORGANISATION && (
        <>
          {source && source?.data.length > 0 && (
            <>
              <h5 id="source">
                <FormattedMessage id="Source" defaultMessage="Source" />:
              </h5>
              <HTMLField value={source} className="source" />
            </>
          )}
        </>
      )}
      {(contributor_list?.length > 0 || other_contributor?.length > 0) && (
        <>
          <h5>
            <FormattedMessage id="Contributor:" defaultMessage="Contributor:" />
          </h5>
          {contributor_list
            .map((item, contributorIndex) => (
              <React.Fragment key={item.title}>
                {item.title}
                <br />
              </React.Fragment>
            ))
            .sort()}
          {other_contributor}
        </>
      )}
      {contributions && contributions.length > 0 && (
        <>
          <h5>
            <FormattedMessage
              id="Observatory Contributions:"
              defaultMessage="Observatory Contributions:"
            />
          </h5>
          {!isReadMore ? (
            <List bulleted>
              {contributions_rest.map((item) => (
                <ListItem key={item.url}>
                  <Link to={item.url}>{item.title}</Link>
                </ListItem>
              ))}
            </List>
          ) : (
            <List bulleted>
              {contributions.map((item) => (
                <ListItem key={item.url}>
                  <Link to={item.url}>{item.title}</Link>
                </ListItem>
              ))}
            </List>
          )}
          {contributions.length > 10 && (
            <Button
              basic
              icon
              primary
              onClick={() => setIsReadMore(!isReadMore)}
            >
              {!isReadMore ? (
                <>
                  <strong>
                    <FormattedMessage id="See more" defaultMessage="See more" />
                  </strong>
                  <Icon className="ri-arrow-down-s-line" />
                </>
              ) : (
                <>
                  <strong>
                    <FormattedMessage id="See less" defaultMessage="See less" />
                  </strong>
                  <Icon className="ri-arrow-up-s-line" />
                </>
              )}
            </Button>
          )}
          <div>
            <Button>
              <Link to={search_link}>
                <FormattedMessage
                  id="View all contributions in the resource catalogue"
                  defaultMessage="View all contributions in the resource catalogue"
                />
              </Link>
            </Button>
          </div>
        </>
      )}
    </>
  ) : null;
};

export default ReferenceInfo;
