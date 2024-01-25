import { booleanFacet } from '@eeacms/search';
import { getTodayWithTime } from './utils';

export const include_archived = booleanFacet(() => ({
  field: 'IncludeArchived',
  label: 'Include archived content',
  id: 'archived-facet',
  showInFacetsList: false,
  showInSecondaryFacetsList: true,
  isFilter: true, // filters don't need facet options to show up

  // we want this to be applied by default
  // when the facet is checked, then apply the `on` key:
  off: {
    constant_score: {
      filter: {
        bool: {
          should: [
            { bool: { must_not: { exists: { field: 'expires' } } } },
            // Functions should be supported in the buildFilters
            { range: { expires: { gte: getTodayWithTime() } } },
          ],
        },
      },
    },
  },
  on: null,
}));
