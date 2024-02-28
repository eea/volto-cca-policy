import { UniversalLink } from '@plone/volto/components';
import config from '@plone/volto/registry';
import { Divider } from 'semantic-ui-react';

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
        <ul>
          {value.map((linkItem, index) => (
            <li key={index}>
              {isInternal ? (
                <UniversalLink href={linkItem[0]}>{linkItem[1]}</UniversalLink>
              ) : (
                <ExternalLink url={linkItem[0]} text={linkItem[1]} />
              )}
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    return (
      <>
        <h5 id="websites">{title}</h5>
        <ul>
          {value.map((url, index) => (
            <li key={index}>
              <ExternalLink url={url} text={url} />
            </li>
          ))}
        </ul>
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
  return (
    <>
      <h2>Description</h2>
      <HTMLField value={content.long_description} />
      <Divider />
      <h2>Reference information</h2>

      {content?.websites?.length > 0 && (
        <LinksList title="Websites:" value={content.websites} />
      )}

      {content.source && (
        <>
          <h4>Source:</h4>
          <HTMLField value={content.source} className="source" />
        </>
      )}

      {content?.contributor_list?.length > 0 && (
        <>
          <h4>Contributor</h4>
          {content.contributor_list.sort().map((item) => (
            <>
              {item.title}
              <br />
            </>
          ))}
        </>
      )}
    </>
  );
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
  const files = content.cca_files;
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

  if (content['@type'] === 'eea.climateadapt.casestudy') {
    section_title = 'Case Studies Documents';
  }

  if (content['@type'] === 'eea.climateadapt.publicationreport') {
    section_title = 'Publications and Reports Documents';
  }
  return (
    <>
      <h5>
        {section_title} {content.show_counter && <>({files.length})</>}
      </h5>
      <ul className="documents-list">
        {files.map((file, index) => (
          <li key={index}>
            <a href={file.url}>
              <i className="file alternate icon"></i>
              {file.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
