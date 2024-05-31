import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { UniversalLink } from '@plone/volto/components';
import config from '@plone/volto/registry';
import {
  Segment,
  Image,
  ListItem,
  List,
  Button,
  Icon,
  Label,
} from 'semantic-ui-react';
import {
  CASE_STUDY,
  PUBLICATION_REPORT,
  ORGANISATION,
  ADAPTATION_OPTION,
  ACE_PROJECT,
  VIDEO,
} from '@eeacms/volto-cca-policy/helpers/Constants';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';
import { makeContributionsSearchQuery } from '@eeacms/volto-cca-policy/helpers';
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  documents: {
    id: 'Documents',
    defaultMessage: 'Documents',
  },
  caseStudiesDocuments: {
    id: 'Case Studies Documents',
    defaultMessage: 'Case Studies Documents',
  },
  publicationsAndReportsDocuments: {
    id: 'Publications and Reports Documents',
    defaultMessage: 'Publications and Reports Documents',
  },
  organisationDocuments: {
    id: 'Organisation Documents',
    defaultMessage: 'Organisation Documents',
  },
});

export const HTMLField = ({ value, className }) => {
  if (value === null) {
    return <></>;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: value?.data }}
    ></div>
  );
};

export const ExternalLink = (props) => {
  let { url, text } = props;

  if (text === undefined) {
    text = url;
  }

  return <a href={url}>{text}</a>;
};

export const LinksList = (props) => {
  let { title, value, withText, isInternal } = props;

  if (isInternal === undefined) {
    isInternal = false;
  }

  if (withText === true) {
    return (
      <>
        <h5 id="websites">{title}</h5>
        <List>
          {value.map((linkItem, index) => (
            <ListItem key={index}>
              {isInternal ? (
                <UniversalLink href={linkItem[0]}>{linkItem[1]}</UniversalLink>
              ) : (
                <ExternalLink url={linkItem[0]} text={linkItem[1]} />
              )}
            </ListItem>
          ))}
        </List>
      </>
    );
  } else {
    return (
      <>
        <h5 id="websites">{title}</h5>
        <List>
          {value.map((url, index) => (
            <ListItem key={index}>
              <ExternalLink url={url} text={url} />
            </ListItem>
          ))}
        </List>
      </>
    );
  }
};

export const BannerTitle = (props) => {
  const { content, data } = props;
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;

  return <TitleBlockView {...props} data={data} metadata={content} />;
};

export const ReferenceInfo = (props) => {
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

  let source_title;
  if (type === ADAPTATION_OPTION) {
    source_title = (
      <FormattedMessage id="References" defaultMessage="References" />
    );
  } else {
    source_title = <FormattedMessage id="Source" defaultMessage="Source" />;
  }

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
        <LinksList
          title={<FormattedMessage id="Websites:" defaultMessage="Websites:" />}
          value={websites}
        />
      )}

      {type !== ACE_PROJECT && type !== ORGANISATION && (
        <>
          {source && source?.data.length > 0 && (
            <>
              <h5 id="source">{source_title}:</h5>
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
            .map((item) => (
              <>
                {item.title}
                <br />
              </>
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
            <>
              <List bulleted>
                {contributions_rest.map((item, index) => (
                  <ListItem key={index}>
                    <Link to={item.url}>{item.title}</Link>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <>
              <List bulleted>
                {contributions.map((item, index) => (
                  <ListItem key={index}>
                    <Link to={item.url}>{item.title}</Link>
                  </ListItem>
                ))}
              </List>
            </>
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

export const PublishedModifiedInfo = (props) => {
  const { content } = props;

  const cca_modif = content.cca_last_modified;
  const cca_publ = content.cca_published;

  let published = null;
  let modified = null;
  const dateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  if (cca_modif !== undefined) {
    modified = new Date(cca_modif).toLocaleString('default', dateFormatOptions);
  } else {
    modified = new Date(content.modification_date).toLocaleString(
      'default',
      dateFormatOptions,
    );
  }
  if (cca_publ !== undefined) {
    published = new Date(cca_publ).toLocaleString('default', dateFormatOptions);
  } else {
    published = new Date(content.publication_date).toLocaleString(
      'default',
      dateFormatOptions,
    );
  }

  // TODO fix wrong information for some cases. Test for each content type.
  return (
    <div className="published-modified-info">
      <p>
        <span>
          <strong>
            <FormattedMessage
              id="Published in Climate-ADAPT"
              defaultMessage="Published in Climate-ADAPT"
            />
          </strong>
          &nbsp;
          {published}
        </span>
        <span> &nbsp; - &nbsp; </span>
        <span>
          <strong>
            <FormattedMessage
              id="Last Modified in Climate-ADAPT"
              defaultMessage="Last Modified in Climate-ADAPT"
            />
          </strong>
          &nbsp;
          {modified}
        </span>
      </p>
    </div>
  );
};

export const DocumentsList = (props) => {
  const { content } = props;
  const type = content['@type'];
  const files = content?.cca_files;
  const intl = useIntl();

  if (!files || files.length === 0) {
    return null;
  }
  if (!content.hasOwnProperty('show_counter')) {
    content.show_counter = true;
  }

  let section_title = intl.formatMessage(messages.documents);

  if (content['section_title']) {
    section_title = content['section_title'];
  }

  if (type === CASE_STUDY) {
    section_title = intl.formatMessage(messages.caseStudiesDocuments);
  }

  if (type === PUBLICATION_REPORT) {
    section_title = intl.formatMessage(
      messages.publicationsAndReportsDocuments,
    );
  }

  if (type === ORGANISATION) {
    section_title = intl.formatMessage(messages.organisationDocuments);
  }

  return (
    <Segment>
      <h5>
        {section_title} {content.show_counter && <>({files.length})</>}
      </h5>
      <List className="documents-list">
        {files.map((file, index) => (
          <ListItem key={index}>
            <a href={file.url} className="document-list-item">
              <i className="file alternate icon"></i>
              <span>{file.title}</span>
            </a>
          </ListItem>
        ))}
      </List>
    </Segment>
  );
};

export const ContentRelatedItems = (props) => {
  const { content } = props;
  const { relatedItems } = content;

  let contentRelatedItems = [];
  if (relatedItems && relatedItems?.length > 0) {
    contentRelatedItems = relatedItems.filter((item) =>
      item['@type'].includes('eea.climateadapt'),
    );
  }

  return contentRelatedItems.length > 0 ? (
    <>
      <h5>
        <FormattedMessage
          id="Related content:"
          defaultMessage="Related content:"
        />
      </h5>

      {contentRelatedItems.map((item, index) => (
        <Fragment key={index}>
          <UniversalLink item={item}>{item.title}</UniversalLink>
          <br />
        </Fragment>
      ))}
    </>
  ) : null;
};

export const LogoWrapper = ({ logo, children }) =>
  logo ? <div className="has-logo">{children}</div> : children;

export const ItemLogo = (props) => {
  const { content } = props;
  const type = content['@type'];
  const { image, logo, title } = content;

  let logo_image;
  if (logo) {
    logo_image = logo;
  } else if (!logo && image) {
    logo_image = image;
  } else {
    logo_image = null;
  }

  return type !== VIDEO ? (
    <LogoWrapper logo={logo_image}>
      <h2>
        <FormattedMessage id="Description" defaultMessage="Description" />
      </h2>
      {logo_image && (
        <Image
          src={logo_image?.scales?.mini?.download}
          alt={title}
          className="db-logo"
        />
      )}
    </LogoWrapper>
  ) : null;
};

export const SubjectTags = (props) => {
  const { content } = props;
  const tags = content?.subjects;

  return tags?.length > 0 ? (
    <div className="tags">
      Filed under:{' '}
      {tags.map((tag) => (
        <Label size="small" key={tag}>
          {tag}
        </Label>
      ))}
    </div>
  ) : null;
};

export const EventDetails = (props) => {
  const { content } = props;

  return (
    <>
      <h4>
        <FormattedMessage id="When" defaultMessage="When" />
      </h4>
      <When
        start={content.start}
        end={content.end}
        whole_day={content.whole_day}
        open_end={content.open_end}
      />
      {content?.location !== null && (
        <>
          <h4>
            <FormattedMessage id="Where" defaultMessage="Where" />
          </h4>
          <p>{content.location}</p>
        </>
      )}
      {!!content.contact_email && (
        <>
          <h4>
            <FormattedMessage id="Info" defaultMessage="Info" />
          </h4>
          <p>{content.contact_email}</p>
        </>
      )}
    </>
  );
};

export const MetadataItemList = (props) => {
  const { value, join_type } = props;

  return value && value.length > 0 ? (
    <>
      {!join_type ? (
        <p>{value.map((item) => item.title).join(', ')}</p>
      ) : (
        <>
          {value.map((item, index) => (
            <React.Fragment key={index}>
              <span>{item.title}</span>
              {index !== value.length - 1 && (
                <span dangerouslySetInnerHTML={{ __html: join_type }} />
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  ) : null;
};
