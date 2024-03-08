import React, { Fragment } from 'react';
import { UniversalLink } from '@plone/volto/components';
import config from '@plone/volto/registry';
import { Segment, Image, ListItem, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
  CASE_STUDY,
  PUBICATION_REPORT,
  ORGANISATION,
  ADAPTATION_OPTION,
  ACE_PROJECT,
} from '@eeacms/volto-cca-policy/helpers/Constants';

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
        <List bulleted>
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
        <List bulleted>
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
  const { content, type } = props;
  const {
    blocks: { blocksConfig },
  } = config;
  const TitleBlockView = blocksConfig?.title?.view;

  return (
    <TitleBlockView
      {...props}
      data={{
        info: [{ description: '' }],
        hideContentType: true,
        hideCreationDate: false,
        hideModificationDate: false,
        hidePublishingDate: false,
        hideDownloadButton: false,
        hideShareButton: false,
        subtitle: type,
      }}
      metadata={content}
    />
  );
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

  let source_title;
  if (type === ADAPTATION_OPTION) {
    source_title = 'References';
  } else {
    source_title = 'Source';
  }

  return websites?.length > 0 ||
    (source && source?.data.length > 0) ||
    contributor_list?.length > 0 ||
    other_contributor?.length > 0 ? (
    <>
      <h2>Reference information</h2>

      {websites?.length > 0 && <LinksList title="Websites:" value={websites} />}

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
          <h5>Contributor:</h5>
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
          <h5>Observatory Contributions:</h5>
          <List bulleted>
            {contributions.map((item, index) => (
              <ListItem key={index}>
                <Link to={item.url}>{item.title}</Link>
              </ListItem>
            ))}
          </List>
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
          <strong>Published in Climate-ADAPT</strong>
          &nbsp;
          {published}
        </span>
        <span> &nbsp; - &nbsp; </span>
        <span>
          <strong>Last Modified in Climate-ADAPT</strong>
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
  if (!files || files.length === 0) {
    return null;
  }
  if (!content.hasOwnProperty('show_counter')) {
    content.show_counter = true;
  }

  let section_title = 'Documents';

  if (content['section_title']) {
    section_title = content['section_title'];
  }

  if (type === CASE_STUDY) {
    section_title = 'Case Studies Documents';
  }

  if (type === PUBICATION_REPORT) {
    section_title = 'Publications and Reports Documents';
  }

  if (type === ORGANISATION) {
    section_title = 'Organisation Documents';
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
      <h5>Related content:</h5>

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
  const { image, logo, title } = content;

  let logo_image;
  if (logo) {
    logo_image = logo;
  } else if (!logo && image) {
    logo_image = image;
  } else {
    logo_image = null;
  }

  return (
    <LogoWrapper logo={logo_image}>
      <h2>Description</h2>
      {logo_image && (
        <Image
          src={logo_image?.scales?.mini?.download}
          alt={title}
          className="db-logo"
        />
      )}
    </LogoWrapper>
  );
};

export const isObservatoryURL = (url) => {
  return url.indexOf('/observatory/++aq++metadata') > -1;
};
