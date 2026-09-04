import React, { useEffect, useState } from 'react';
import { Checkbox, Icon, Popup } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import Image from '@plone/volto/components/theme/Image/Image';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import ExternalLink from '@eeacms/search/components/Result/ExternalLink';
import ResultContext from '@eeacms/search/components/Result/ResultContext';
import {
  getCompareToolTitle,
  getCompareToolUid,
  useCompareTools,
} from '../../theme/CompareTools/utils';
import { rawValueAsArray } from './utils';

export function getToolThumbnailUrl(result) {
  if (!result) return null;

  if (result.image === null || result.image === false) {
    return null;
  }

  if (typeof result.image === 'string' && result.image) {
    return flattenToAppURL(result.image);
  }
  if (result.image && typeof result.image === 'object') {
    const scaleUrl =
      result.image.scales?.thumb?.download ||
      result.image.scales?.tile?.download ||
      result.image.scales?.preview?.download ||
      result.image.scales?.mini?.download ||
      result.image.download;
    if (scaleUrl) {
      return flattenToAppURL(scaleUrl);
    }
  }

  if (
    typeof result.thumbUrl === 'string' &&
    result.thumbUrl &&
    !result.thumbUrl.includes('portal_depiction')
  ) {
    return flattenToAppURL(result.thumbUrl);
  }

  if (
    result.image_preview &&
    typeof result.image_preview.raw === 'string' &&
    result.image_preview.raw
  ) {
    return flattenToAppURL(result.image_preview.raw);
  }

  const href =
    result.href || result['@id'] || result.about?.raw || result.about;
  if (href && typeof href === 'string') {
    const cleanHref = flattenToAppURL(href).replace(/\/+$/, '');
    return `${cleanHref}/@@images/image/thumb`;
  }

  return null;
}

const messages = defineMessages({
  sector: {
    id: 'Sector',
    defaultMessage: 'Sector',
  },
  hazard: {
    id: 'Hazard',
    defaultMessage: 'Hazard',
  },
  cycle: {
    id: 'Cycle',
    defaultMessage: 'Cycle',
  },
  license: {
    id: 'License',
    defaultMessage: 'License',
  },
  type: {
    id: 'Type',
    defaultMessage: 'Type',
  },
  compare: {
    id: 'Compare',
    defaultMessage: 'Compare',
  },
  viewTool: {
    id: 'View',
    defaultMessage: 'View',
  },
});

const publicationDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
});

const TagGroup = ({ typeLabel, values, type }) => {
  const visible = values.slice(0, 3);
  const hidden = values.slice(3);
  const remaining = values.length - visible.length;

  return (
    <div className="navigator-catalogue-tags">
      {visible.map((value) => (
        <span key={`${type}-${value}`} className={`navigator-tag ${type}`}>
          {value}
        </span>
      ))}
      {remaining > 0 && (
        <Popup
          className="catalogue-tag-popup"
          content={
            <div className="catalogue-tag-tooltip">
              <ul>
                {hidden.map((value) => (
                  <li key={`${type}-hidden-${value}`}>{value}</li>
                ))}
              </ul>
            </div>
          }
          position="bottom left"
          trigger={
            <button
              type="button"
              className={`navigator-tag ${type} more`}
              aria-label={`${typeLabel}: ${hidden.join(', ')}`}
            >
              + {remaining}
            </button>
          }
        />
      )}
    </div>
  );
};

const CycleElements = ({ intl, values }) => {
  const visible = values.slice(0, 3);

  if (!visible.length) return null;

  return (
    <div className="navigator-catalogue-cycle-elements">
      <span className="cycle-elements-label">
        {intl.formatMessage(messages.cycle)}
      </span>
      {visible.map((value, index) => (
        <span
          key={`cycle-element-${index}`}
          className="navigator-tag cycle-element"
        >
          {value}
        </span>
      ))}
    </div>
  );
};

const NavigatorCatalogueCardItem = (props) => {
  const { result } = props;
  const intl = useIntl();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const thumbUrl = getToolThumbnailUrl(result);

  useEffect(() => {
    setImageLoaded(false);
    setHasImageError(false);
  }, [thumbUrl]);

  const sectors = rawValueAsArray(result.cca_adaptation_sectors);
  const hazards = rawValueAsArray(result.cca_climate_impacts);
  const licenseStatus = rawValueAsArray(result.cca_license_status)
    .map((value) => value?.title || value)
    .filter(Boolean)
    .join(', ');
  const toolProvider = result?._result?.tool_provider?.raw;
  const adaptationSupportCycleSteps = rawValueAsArray(
    result.adaptation_support_cycle_step,
  )
    .map((value) => value?.title?.split(':')[0])
    .filter(Boolean);
  const publicationDate =
    result.publication_date?.raw || result.publication_date;
  const formattedPublicationDate = publicationDate
    ? publicationDateFormatter.format(new Date(publicationDate))
    : '';
  const sectorLabel = intl.formatMessage(messages.sector);
  const hazardLabel = intl.formatMessage(messages.hazard);
  const compareTool = {
    uid: getCompareToolUid(result),
    title: getCompareToolTitle(result),
    href: result.href,
  };
  const { isSelected, isLimitReached, setSelected } =
    useCompareTools(compareTool);

  const onCompareChange = (event, { checked }) => {
    setSelected(checked);
  };

  return (
    <div className={`navigator-catalogue-item${isSelected ? ' selected' : ''}`}>
      <div className="navigator-tool-icon large" aria-hidden="true">
        {thumbUrl && !hasImageError ? (
          <>
            <Image
              src={thumbUrl}
              alt=""
              style={imageLoaded ? undefined : { display: 'none' }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setHasImageError(true)}
            />
            {!imageLoaded && <Icon className="ri-file-line" />}
          </>
        ) : (
          <Icon className="ri-file-line" />
        )}
      </div>

      <div className="catalogue-item-main">
        <div className="catalogue-item-top">
          <div className="navigator-tool-provider" title={toolProvider}>
            {toolProvider}
          </div>
          {formattedPublicationDate && (
            <span className="catalogue-date">{formattedPublicationDate}</span>
          )}
        </div>
        <div className="catalogue-item-heading">
          <h4>
            <ExternalLink href={result.href} title={result.title}>
              {result.title || '[Tool name]'}
            </ExternalLink>
          </h4>
        </div>

        <p className="catalogue-description">
          <ResultContext {...props} />
        </p>

        <div className="catalogue-taxonomy">
          <TagGroup typeLabel={sectorLabel} values={sectors} type="sector" />
          <TagGroup typeLabel={hazardLabel} values={hazards} type="hazard" />
        </div>

        <div className="catalogue-item-footer">
          <div className="catalogue-meta">
            <CycleElements intl={intl} values={adaptationSupportCycleSteps} />
          </div>

          <div className="catalogue-meta license-type">
            {licenseStatus && (
              <>
                <span className="catalogue-licence" title={licenseStatus}>
                  {intl.formatMessage(messages.license)}: {licenseStatus}
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="catalogue-type">
              {intl.formatMessage(messages.type)}: Tool
            </span>
          </div>

          <div className="catalogue-actions">
            <label className="catalogue-compare">
              <Checkbox
                checked={isSelected}
                disabled={isLimitReached || !compareTool.uid}
                onChange={onCompareChange}
              />
              <span>{intl.formatMessage(messages.compare)}</span>
            </label>
            <ExternalLink
              href={result.href}
              className="ui button primary icon"
              labelPosition="left"
            >
              {intl.formatMessage(messages.viewTool)}
              <Icon className="ri-arrow-right-line" />
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigatorCatalogueCardItem;
