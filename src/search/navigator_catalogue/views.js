const viewsCatalogue = {
  resultViews: [
    {
      id: 'listing',
      title: 'List view',
      icon: 'ri-list-check',
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
      icon: 'ri-map-2-line',
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
