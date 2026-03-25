import React, { useCallback, useRef } from 'react';
import { Button, Dimmer, Loader, Message } from 'semantic-ui-react';
import { useIntl, defineMessages } from 'react-intl';
import { useLocation } from 'react-router-dom';
import loadable from '@loadable/component';
import useLinkEditor from '@plone/volto/components/manage/AnchorPlugin/useLinkEditor';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';

import {
  flattenToAppURL,
  isInternalURL,
  validateFileUploadSize,
} from '@plone/volto/helpers';
import { readAsDataURL } from 'promise-file-reader';
import { FormFieldWrapper, Icon } from '@plone/volto/components';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';

const Dropzone = loadable(() => import('react-dropzone'));

const messages = defineMessages({
  addImage: {
    id: 'Browse the site, drop an image, or type a URL',
    defaultMessage: 'Browse the site, drop an image, or use a URL',
  },
  pickAnImage: {
    id: 'pickAnImage',
    defaultMessage: 'Pick an existing image',
  },
  uploadAnImage: {
    id: 'uploadAnImage',
    defaultMessage: 'Upload an image from your computer',
  },
  linkAnImage: {
    id: 'linkAnImage',
    defaultMessage: 'Enter a URL to an image',
  },
  uploadingImage: {
    id: 'Uploading image',
    defaultMessage: 'Uploading image',
  },
  imageImportFailed: {
    id: 'imageImportFailed',
    defaultMessage: 'Could not import the selected image.',
  },
});

const resolveLinkedImageUrl = (inputValue, imageSize) => {
  if (!inputValue) return null;

  if (!isInternalURL(inputValue)) {
    return inputValue;
  }

  const flat = flattenToAppURL(inputValue);

  if (flat.includes('/@@images/') || flat.includes('/@@download/')) {
    return flat;
  }

  return `${flat}/@@images/image/${imageSize}`;
};

const getImagePreviewSrc = (value, imageSize = 'teaser') => {
  if (!value) return null;

  if (typeof value === 'string') {
    if (!isInternalURL(value)) return value;

    const flat = flattenToAppURL(value);
    if (flat.includes('/@@images/') || flat.includes('/@@download/')) {
      return flat;
    }
    return `${flat}/@@images/image/${imageSize}`;
  }

  if (typeof value === 'object') {
    if (value.scales?.[imageSize]?.download) {
      const url = value.scales[imageSize].download;
      return isInternalURL(url) ? flattenToAppURL(url) : url;
    }

    if (value.download) {
      return isInternalURL(value.download)
        ? flattenToAppURL(value.download)
        : value.download;
    }

    if (value.data && value['content-type'] && value.encoding) {
      return `data:${value['content-type']};${value.encoding},${value.data}`;
    }

    if (value['@id']) {
      return `${flattenToAppURL(value['@id'])}/@@images/image/${imageSize}`;
    }
  }

  return null;
};

const getImageFilename = (value) => {
  if (!value) return '';
  if (typeof value === 'object' && value.filename) return value.filename;
  if (typeof value === 'string') {
    try {
      return value.split('/').filter(Boolean).pop() || '';
    } catch {
      return '';
    }
  }
  return '';
};

const parseDataURL = (dataUrl) => {
  const fields = dataUrl?.match(/^data:(.*);(.*),(.*)$/);
  if (!fields) return null;

  return {
    'content-type': fields[1],
    encoding: fields[2],
    data: fields[3],
  };
};

const readBlobAsDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const getFilenameFromUrl = (url, fallback = 'image') => {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const last = pathname.split('/').filter(Boolean).pop();
    return last || fallback;
  } catch {
    return fallback;
  }
};

const resolveSelectedImageUrl = (url, item, imageSize) => {
  const fromScale = item?.scales?.[imageSize]?.download;
  if (fromScale)
    return isInternalURL(fromScale) ? flattenToAppURL(fromScale) : fromScale;

  if (item?.download) {
    return isInternalURL(item.download)
      ? flattenToAppURL(item.download)
      : item.download;
  }

  if (item?.['@id']) {
    return `${flattenToAppURL(item['@id'])}/@@images/image/${imageSize}`;
  }

  if (typeof url === 'string') {
    const flat = isInternalURL(url) ? flattenToAppURL(url) : url;
    if (flat.includes('/@@images/') || flat.includes('/@@download/')) {
      return flat;
    }
    return `${flat}/@@images/image/${imageSize}`;
  }

  return null;
};

export const ImageToolbar = ({ id, onChange }) => (
  <div className="image-upload-widget-toolbar">
    <Button
      icon
      basic
      className="delete-btn"
      onClick={() => onChange(id, null)}
    >
      <Icon name={deleteSVG} size="22px" />
    </Button>
  </div>
);

const UnconnectedImageInput = (props) => {
  const {
    id,
    onChange,
    onFocus,
    openObjectBrowser,
    value,
    imageSize = 'teaser',
    selected = true,
    hideLinkPicker = false,
    hideObjectBrowserPicker = false,
    restrictFileUpload = false,
    objectBrowserPickerType = 'image',
    placeholderLinkInput = '',
    onSelectItem,
    isDisabled,
  } = props;

  const intl = useIntl();
  const linkEditor = useLinkEditor();
  const location = useLocation();

  const [uploading, setUploading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState(null);

  const imageUploadInputRef = useRef(null);

  const previewSrc = getImagePreviewSrc(value, imageSize);
  const filename = getImageFilename(value);

  const setFileValueFromDataUrl = useCallback(
    (dataUrl, fallbackFilename = 'image') => {
      const parsed = parseDataURL(dataUrl);
      if (!parsed) return;

      onChange(id, {
        data: parsed.data,
        encoding: parsed.encoding,
        'content-type': parsed['content-type'],
        filename: fallbackFilename,
      });
    },
    [id, onChange],
  );

  const importImageFromUrl = useCallback(
    async (url, fallbackFilename = 'image') => {
      setUploading(true);
      setError(null);

      try {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();

        if (!blob.type.startsWith('image/')) {
          throw new Error('Selected URL is not an image');
        }

        const dataUrl = await readBlobAsDataURL(blob);
        const filenameFromUrl = getFilenameFromUrl(url, fallbackFilename);

        setFileValueFromDataUrl(dataUrl, filenameFromUrl);
      } catch (e) {
        setError(intl.formatMessage(messages.imageImportFailed));
      } finally {
        setUploading(false);
      }
    },
    [intl, setFileValueFromDataUrl],
  );

  const handleUpload = useCallback(
    (eventOrFile) => {
      if (restrictFileUpload === true) return;
      eventOrFile?.target && eventOrFile.stopPropagation();

      const file = eventOrFile?.target
        ? eventOrFile.target.files[0]
        : eventOrFile?.[0];

      if (!file) return;
      if (!validateFileUploadSize(file, intl.formatMessage)) return;

      setDragging(false);
      setUploading(true);
      setError(null);

      readAsDataURL(file)
        .then((fileData) => {
          setFileValueFromDataUrl(fileData, file.name);
        })
        .finally(() => {
          setUploading(false);
        });
    },
    [restrictFileUpload, intl.formatMessage, setFileValueFromDataUrl],
  );

  const handleSelectExistingImage = useCallback(
    async (url, item = {}) => {
      if (onSelectItem) {
        return onSelectItem(url, item);
      }

      const resolvedUrl = resolveSelectedImageUrl(url, item, imageSize);
      if (!resolvedUrl) {
        setError(intl.formatMessage(messages.imageImportFailed));
        return;
      }

      const fallbackFilename =
        item.filename || item.title || getFilenameFromUrl(resolvedUrl, 'image');

      await importImageFromUrl(resolvedUrl, fallbackFilename);
    },
    [imageSize, importImageFromUrl, intl, onSelectItem],
  );

  const handleLinkChange = useCallback(
    async (_, inputValue) => {
      const resolvedUrl = resolveLinkedImageUrl(inputValue, imageSize);

      if (!resolvedUrl) {
        setError(intl.formatMessage(messages.imageImportFailed));
        return;
      }

      await importImageFromUrl(
        resolvedUrl,
        getFilenameFromUrl(inputValue, 'image'),
      );
    },
    [imageSize, importImageFromUrl, intl],
  );

  const onDragEnter = useCallback(() => {
    if (restrictFileUpload === false) setDragging(true);
  }, [restrictFileUpload]);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const toolbar = (
    <div className="toolbar-wrapper">
      <div className="toolbar-inner" ref={linkEditor.anchorNode}>
        {hideObjectBrowserPicker === false && (
          <Button.Group>
            <Button
              aria-label={intl.formatMessage(messages.pickAnImage)}
              icon
              basic
              disabled={isDisabled}
              onClick={(e) => {
                onFocus && onFocus();
                e.preventDefault();
                e.stopPropagation();
                openObjectBrowser({
                  mode: objectBrowserPickerType,
                  onSelectItem: handleSelectExistingImage,
                  currentPath: location.pathname,
                });
              }}
            >
              <Icon name={navTreeSVG} size="24px" />
            </Button>
          </Button.Group>
        )}

        {restrictFileUpload === false && (
          <Button.Group>
            <Button
              aria-label={intl.formatMessage(messages.uploadAnImage)}
              icon
              basic
              compact
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                imageUploadInputRef.current?.click();
              }}
            >
              <Icon name={uploadSVG} size="24px" />
            </Button>
            <input
              type="file"
              ref={imageUploadInputRef}
              onChange={handleUpload}
              style={{ display: 'none' }}
              disabled={isDisabled}
            />
          </Button.Group>
        )}

        {hideLinkPicker === false && (
          <Button.Group>
            <Button
              icon
              basic
              aria-label={intl.formatMessage(messages.linkAnImage)}
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                !selected && onFocus && onFocus();
                linkEditor.show();
              }}
            >
              <Icon name={linkSVG} circled size="24px" />
            </Button>
          </Button.Group>
        )}
      </div>

      {linkEditor.anchorNode && (
        <linkEditor.LinkEditor
          value={typeof value === 'string' ? value : ''}
          placeholder={
            placeholderLinkInput || intl.formatMessage(messages.linkAnImage)
          }
          objectBrowserPickerType={objectBrowserPickerType}
          onChange={handleLinkChange}
          id={id}
        />
      )}
    </div>
  );

  return value ? (
    <div
      id="image-upload-widget-image"
      className="image-upload-widget-image"
      onClick={onFocus}
      onKeyDown={onFocus}
      role="toolbar"
    >
      {uploading && (
        <Dimmer active>
          <Loader indeterminate>
            {intl.formatMessage(messages.uploadingImage)}
          </Loader>
        </Dimmer>
      )}
      {error && <Message negative>{error}</Message>}
      {previewSrc ? (
        <img className={props.className} src={previewSrc} alt="" />
      ) : (
        <Message warning>
          Existing value found, but no image preview could be resolved.
        </Message>
      )}
      {toolbar}
      <div className="field-file-name-wrapper">
        <div className="field-file-name">{filename}</div>
        {selected && <ImageToolbar id={id} onChange={onChange} />}
      </div>
    </div>
  ) : (
    <div
      className="image-upload-widget"
      onClick={onFocus}
      onKeyDown={onFocus}
      role="toolbar"
    >
      <Dropzone
        noClick
        onDrop={handleUpload}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className="dropzone"
        disabled={isDisabled}
      >
        {({ getRootProps }) => (
          <div {...getRootProps()}>
            <Message>
              {dragging && <Dimmer active />}
              {uploading && (
                <Dimmer active>
                  <Loader indeterminate>
                    {intl.formatMessage(messages.uploadingImage)}
                  </Loader>
                </Dimmer>
              )}
              {error && <Message negative>{error}</Message>}
              <img src={imageBlockSVG} alt="" className="placeholder" />
              <p>{intl.formatMessage(messages.addImage)}</p>
              {toolbar}
            </Message>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export const ImageInput = withObjectBrowser(UnconnectedImageInput);

const ImageUploadWidget = (props) => (
  <FormFieldWrapper {...props} className="image-upload-widget">
    <ImageInput {...props} />
  </FormFieldWrapper>
);

export default ImageUploadWidget;
