const viewsCatalogue = {
  resultViews: [
    {
      id: 'listing',
      title: 'List view',
      icon: 'bars',
      render: null,
      isDefault: true,
      factories: {
        view: 'HorizontalCard.Group',
        item: 'NavigatorCatalogueCardItem',
      },
    },
    {
      id: 'map',
      title: 'Map view',
      icon: 'map',
      render: null,
      isDefault: false,
      factories: {
        view: 'NavigatorCatalogueMapView',
        item: 'NavigatorCatalogueCardItem',
      },
    },
  ],
};

export default viewsCatalogue;
