const viewsHealth = {
  resultViews: [
    {
      id: 'healthHorizontalCardItem',
      title: 'Health catalogue items',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'HealthHorizontalCardItem',
      },
    },
  ],
};

export default viewsHealth;
