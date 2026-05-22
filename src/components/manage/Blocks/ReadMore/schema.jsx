const schema = {
  title: 'Read more',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['label_closed', 'label_opened', 'label_position', 'height'],
    },
  ],
  properties: {
    label_closed: {
      title: 'Closed button',
      default: 'Read more',
    },
    label_opened: {
      title: 'Opened button',
      default: 'Read less',
    },
    label_position: {
      title: 'Button position',
      choices: [
        ['left', 'Left'],
        ['right', 'Right'],
      ],
      default: 'right',
    },
    height: {
      title: (
        <a
          rel="noreferrer"
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/height"
        >
          CSS height
        </a>
      ),
      default: '50vh',
      description: 'Visible section height',
    },
  },
  required: [],
};

export default schema;
