import SearchBoxView from '@eeacms/search/components/SearchBox/SearchBoxView';
import NavigatorCataloguePageActions from './NavigatorCataloguePageActions';

const NavigatorCatalogueSearchBox = (props) => (
  <>
    <NavigatorCataloguePageActions />
    <SearchBoxView {...props} />
  </>
);

export default NavigatorCatalogueSearchBox;
