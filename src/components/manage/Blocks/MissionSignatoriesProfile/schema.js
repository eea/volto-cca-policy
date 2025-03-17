export default {
  title: 'Mission Signatories Profile',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['profile_id'],
    },
  ],
  properties: {
    profile_id: {
      title: 'Profile ID',
      type: 'number',
      default: '54403',
    },
  },
  required: [],
};
