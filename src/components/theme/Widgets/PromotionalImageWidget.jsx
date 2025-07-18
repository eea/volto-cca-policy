// Original: https://github.com/plone/volto/blob/16.x.x/src/components/manage/Widgets/FileWidget.jsx

/**
 * FileWidget component.
 * @module components/manage/Widgets/FileWidget
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Image, Dimmer } from 'semantic-ui-react';
import { readAsDataURL } from 'promise-file-reader';
import { injectIntl } from 'react-intl';
import deleteSVG from '@plone/volto/icons/delete.svg';
import { Icon, FormFieldWrapper } from '@plone/volto/components';
import loadable from '@loadable/component';
import { flattenToAppURL, validateFileUploadSize } from '@plone/volto/helpers';
import { defineMessages, useIntl } from 'react-intl';

const imageMimetypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jpg',
  'image/gif',
  'image/svg+xml',
];
const Dropzone = loadable(() => import('react-dropzone'));

const messages = defineMessages({
  releaseDrag: {
    id: 'Drop files here ...',
    defaultMessage: 'Drop files here ...',
  },
  editFile: {
    id: 'Drop file here to replace the existing file',
    defaultMessage: 'Drop file here to replace the existing file',
  },
  fileDrag: {
    id: 'Drop file here to upload a new file',
    defaultMessage: 'Drop file here to upload a new file',
  },
  replaceFile: {
    id: 'Replace existing file',
    defaultMessage: 'Replace existing file',
  },
  addNewFile: {
    id: 'Choose a file',
    defaultMessage: 'Choose a file',
  },
});

/**
 * FileWidget component class.
 * @function FileWidget
 * @returns {string} Markup of the component.
 *
 * To use it, in schema properties, declare a field like:
 *
 * ```jsx
 * {
 *  title: "File",
 *  widget: 'file',
 * }
 * ```
 * or:
 *
 * ```jsx
 * {
 *  title: "File",
 *  type: 'object',
 * }
 * ```
 *
 */
function parseDataURL(dataUrl) {
  if (!dataUrl.startsWith('data:')) return null;

  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) return null;

  const meta = dataUrl.slice(5, commaIndex);
  const data = dataUrl.slice(commaIndex + 1);

  const [contentType, encoding] = meta.split(';');

  return {
    'content-type': contentType || '',
    encoding: encoding || '',
    data: data || '',
  };
}

const FileWidget = (props) => {
  const { id, value, onChange, isDisabled } = props;
  const [fileType, setFileType] = React.useState(false);
  const intl = useIntl();

  React.useEffect(() => {
    if (value && imageMimetypes.includes(value['content-type'])) {
      setFileType(true);
    }
  }, [value]);

  const imgsrc = value?.download
    ? `${flattenToAppURL(value?.download)}?id=${Date.now()}`
    : value?.data
    ? `data:${value['content-type']};${value.encoding},${value.data}`
    : null;

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * @returns {undefined}
   */
  const onDrop = (files) => {
    const file = files[0];
    if (!validateFileUploadSize(file, intl.formatMessage)) return;
    readAsDataURL(file).then((data) => {
      const fields = parseDataURL(data);
      if (fields) {
        onChange(id, {
          data: fields.data,
          encoding: fields.encoding,
          'content-type': fields['content-type'],
          filename: file.name,
        });
      }
    });

    const reader = new FileReader();
    reader.onload = function () {
      const parsed = parseDataURL(reader.result);
      if (parsed && imageMimetypes.includes(parsed['content-type'])) {
        setFileType(true);
        const imagePreview = document.getElementById(`field-${id}-image`);
        if (imagePreview) {
          imagePreview.src = reader.result;
        }
      } else {
        setFileType(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <FormFieldWrapper {...props}>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className="file-widget-dropzone" {...getRootProps()}>
            {isDragActive && <Dimmer active></Dimmer>}
            {fileType ? (
              <Image
                className="image-preview"
                id={`field-${id}-image`}
                size="small"
                src={imgsrc}
              />
            ) : (
              <div className="dropzone-placeholder">
                {isDragActive ? (
                  <p className="dropzone-text">
                    {intl.formatMessage(messages.releaseDrag)}
                  </p>
                ) : value ? (
                  <p className="dropzone-text">
                    {intl.formatMessage(messages.editFile)}
                  </p>
                ) : (
                  <p className="dropzone-text">
                    {intl.formatMessage(messages.fileDrag)}
                  </p>
                )}
              </div>
            )}

            <label className="label-file-widget-input">
              {value
                ? intl.formatMessage(messages.replaceFile)
                : intl.formatMessage(messages.addNewFile)}
            </label>
            <input
              {...getInputProps({
                type: 'file',
                style: { display: 'none' },
              })}
              id={`field-${id}`}
              name={id}
              type="file"
              disabled={isDisabled}
            />
          </div>
        )}
      </Dropzone>

      {value && value.download && (
        <a
          className="image-download-btn"
          href={flattenToAppURL(value.download)}
          download={value.filename || 'download'}
        >
          Download image
        </a>
      )}
      <div className="field-file-name">
        {value && value.filename}
        {value && (
          <Button
            type="button"
            icon
            basic
            className="delete-button"
            aria-label="delete file"
            disabled={isDisabled}
            onClick={() => {
              onChange(id, null);
              setFileType(false);
            }}
          >
            <Icon name={deleteSVG} size="20px" />
          </Button>
        )}
      </div>
    </FormFieldWrapper>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
FileWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.shape({
    '@type': PropTypes.string,
    title: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  wrapped: PropTypes.bool,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
FileWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
};

export default injectIntl(FileWidget);
