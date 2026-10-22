import React from 'react';
import { getFacetOptions } from '@eeacms/search/components/SearchApp/useFacetsWithAllOptions';
import { getGuideStepFields } from '../../../search/navigator_guide/guideSteps';

const useGuideFacetOptions = (appConfig, steps) => {
  const [allFacetOptions, setAllFacetOptions] = React.useState({});

  React.useEffect(() => {
    let isCurrent = true;
    const stepFields = [
      ...new Set(steps.flatMap((step) => getGuideStepFields(step))),
    ];

    getFacetOptions(appConfig, stepFields)
      .then((facetOptions) => {
        if (isCurrent) setAllFacetOptions(facetOptions);
      })
      .catch(() => {
        // Live facet options remain available if the supplementary request fails.
      });

    return () => {
      isCurrent = false;
    };
  }, [appConfig, steps]);

  return allFacetOptions;
};

export default useGuideFacetOptions;
