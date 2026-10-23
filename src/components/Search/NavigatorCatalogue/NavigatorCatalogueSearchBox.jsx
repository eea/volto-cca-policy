import SearchBoxView from '@eeacms/search/components/SearchBox/SearchBoxView';
import { NavigatorCataloguePageActions } from '@eeacms/volto-cca-policy/components';

const NavigatorCatalogueSearchBox = (props) => (
  <>
    <NavigatorCataloguePageActions />
    <SearchBoxView {...props} />
  </>
);

export default NavigatorCatalogueSearchBox;
