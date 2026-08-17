import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Form, Input, TextArea } from 'semantic-ui-react';
import FormFieldWrapper from '@plone/volto/components/manage/Widgets/FormFieldWrapper';

import './visualizations.less';

const emptyVisualization = {
  title: '',
  embed_code: '',
  height: '',
  full_width: false,
};

const normalizeVisualizations = (value) =>
  Array.isArray(value)
    ? value.map((item) => ({ ...emptyVisualization, ...(item || {}) }))
    : [];

const VisualizationsWidget = (props) => {
  const { id, value, onChange, isDisabled } = props;
  const visualizations = normalizeVisualizations(value);

  const updateVisualizations = (nextValue) => {
    onChange(id, nextValue);
  };

  const updateItem = (index, field, fieldValue) => {
    updateVisualizations(
      visualizations.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: fieldValue } : item,
      ),
    );
  };

  const addItem = () => {
    updateVisualizations([...visualizations, { ...emptyVisualization }]);
  };

  const deleteItem = (index) => {
    updateVisualizations(
      visualizations.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  return (
    <FormFieldWrapper {...props}>
      <div className="visualizations-widget">
        {visualizations.map((item, index) => (
          <div
            className="visualizations-widget-item"
            key={`visualization-${index}`}
          >
            <div className="visualizations-widget-item-header">
              <h4>Visualization {index + 1}</h4>
              <Button
                type="button"
                basic
                compact
                negative
                disabled={isDisabled}
                onClick={() => deleteItem(index)}
              >
                Delete
              </Button>
            </div>

            <Form.Field>
              <label htmlFor={`${id}-${index}-title`}>Title</label>
              <Input
                id={`${id}-${index}-title`}
                value={item.title || ''}
                disabled={isDisabled}
                onChange={(event) =>
                  updateItem(index, 'title', event.target.value)
                }
              />
            </Form.Field>

            <Form.Field>
              <label htmlFor={`${id}-${index}-embed-code`}>
                Embed code or URL
              </label>
              <TextArea
                id={`${id}-${index}-embed-code`}
                value={item.embed_code || ''}
                disabled={isDisabled}
                rows={5}
                onChange={(event) =>
                  updateItem(index, 'embed_code', event.target.value)
                }
              />
            </Form.Field>

            <Form.Group widths="equal">
              <Form.Field className="visualizations-widget-height">
                <label htmlFor={`${id}-${index}-height`}>Height</label>
                <Input
                  id={`${id}-${index}-height`}
                  value={item.height || ''}
                  disabled={isDisabled}
                  placeholder="800"
                  onChange={(event) =>
                    updateItem(index, 'height', event.target.value)
                  }
                />
              </Form.Field>

              <Form.Field className="visualizations-widget-layout">
                <label>Layout</label>
                <Checkbox
                  label="Full width"
                  checked={!!item.full_width}
                  disabled={isDisabled}
                  onChange={(_, data) =>
                    updateItem(index, 'full_width', data.checked)
                  }
                />
              </Form.Field>
            </Form.Group>
          </div>
        ))}

        <Button
          type="button"
          basic
          compact
          primary
          disabled={isDisabled}
          onClick={addItem}
        >
          Add visualization
        </Button>
      </div>
    </FormFieldWrapper>
  );
};

VisualizationsWidget.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

VisualizationsWidget.defaultProps = {
  value: [],
  isDisabled: false,
};

export default VisualizationsWidget;
