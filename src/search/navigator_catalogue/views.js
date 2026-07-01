const viewsCatalogue = {
  resultViews: [
    {
      id: 'navigatorCatalogueList',
      title: 'Navigator catalogue items',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'NavigatorCatalogueCardItem',
      },
    },
  ],
};

export default viewsCatalogue;
