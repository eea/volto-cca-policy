import React from 'react';
import { getFacetOptions } from '@eeacms/search/components/SearchApp/useFacetsWithAllOptions';
import { getGuideStepFields } from '../../../search/navigator_guide/guideSteps';

const useGuideFacetOptions = (appConfig, steps, language = 'en') => {
  const [allFacetOptions, setAllFacetOptions] = React.useState({});
  const stepFieldsKey = JSON.stringify([
    ...new Set(steps.flatMap((step) => getGuideStepFields(step))),
  ]);

  React.useEffect(() => {
    let isCurrent = true;
    const stepFields = JSON.parse(stepFieldsKey);
    const languageConfig = {
      ...appConfig,
      permanentFilters: [
        ...(appConfig.permanentFilters || []),
        { term: { language } },
      ],
    };

    setAllFacetOptions((current) =>
      Object.keys(current).length ? {} : current,
    );

    getFacetOptions(languageConfig, stepFields)
      .then((facetOptions) => {
        if (isCurrent) setAllFacetOptions(facetOptions);
      })
      .catch(() => {
        // Live facet options remain available if the supplementary request fails.
      });

    return () => {
      isCurrent = false;
    };
  }, [appConfig, language, stepFieldsKey]);

  return allFacetOptions;
};

export default useGuideFacetOptions;
