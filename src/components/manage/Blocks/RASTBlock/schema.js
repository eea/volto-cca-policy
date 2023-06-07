const fields = ['step_1', 'step_2', 'step_3', 'step_4', 'step_5', 'step_6'];

export default {
  title: 'RAST',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields,
    },
  ],

  properties: {
    step_1: {
      title: 'Step 1',
      widget: 'object_browser',
      mode: 'link',
    },
    step_2: {
      title: 'Step 2',
      widget: 'object_browser',
      mode: 'link',
    },
    step_3: {
      title: 'Step 3',
      widget: 'object_browser',
      mode: 'link',
    },
    step_4: {
      title: 'Step 4',
      widget: 'object_browser',
      mode: 'link',
    },
    step_5: {
      title: 'Step 5',
      widget: 'object_browser',
      mode: 'link',
    },
    step_6: {
      title: 'Step 6',
      widget: 'object_browser',
      mode: 'link',
    },
  },

  required: [],
};
