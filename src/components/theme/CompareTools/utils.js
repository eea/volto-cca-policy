import { atom, useAtom } from 'jotai';
import { applyConfigurationSchema, rebind } from '@eeacms/search';
import runRequest from '@eeacms/search/lib/runRequest';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { getComparePageURL } from '../../Search/NavigatorCatalogue/utils';

export const MAX_COMPARE_TOOLS = 4;
export const compareToolsAtom = atom([]);
const searchAppName = 'navigatorCatalogueSearch';

const getRawValue = (value) =>
  value?.raw !== undefined ? value.raw : value || '';

export const getCompareToolUid = (result) =>
  getRawValue(result.cca_uid || result.UID || result._result?.cca_uid);

export const getCompareToolTitle = (result) => result.title || '';

export const getPathname = (url) => {
  if (!url) return '';

  const pathname = flattenToAppURL(url).split('#')[0].split('?')[0];

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

export const useCompareTools = (compareTool) => {
  const [selectedTools, setSelectedTools] = useAtom(compareToolsAtom);
  const isSelected = selectedTools.some(
    (tool) => tool.uid === compareTool?.uid,
  );
  const isLimitReached =
    selectedTools.length >= MAX_COMPARE_TOOLS && !isSelected;

  const setSelected = (selected) => {
    if (!compareTool?.uid) return;

    setSelectedTools((tools) => {
      if (!selected) {
        return tools.filter((tool) => tool.uid !== compareTool.uid);
      }

      if (
        tools.some((tool) => tool.uid === compareTool.uid) ||
        tools.length >= MAX_COMPARE_TOOLS
      ) {
        return tools;
      }

      return [...tools, compareTool];
    });
  };

  return {
    isSelected,
    isLimitReached,
    setSelected,
    toggle: () => setSelected(!isSelected),
  };
};

export const getCompareLocation = (
  tools,
  appConfig,
  currentLang = 'en',
  returnURL,
) => {
  const params = new URLSearchParams();

  tools.slice(0, MAX_COMPARE_TOOLS).forEach((tool) => {
    if (tool.uid) {
      params.append('uid', tool.uid);
    }
  });

  const query = params.toString();
  const path = getComparePageURL(appConfig, currentLang);

  return {
    pathname: path,
    search: query ? `?${query}` : '',
    state: { returnURL },
  };
};

export const fetchResultsByUid = async (uids, registry) => {
  const appConfig = applyConfigurationSchema(
    rebind(registry.searchui[searchAppName]),
  );
  const response = await runRequest(
    {
      ...(appConfig.index_name ? { index: appConfig.index_name } : {}),
      size: uids.length,
      query: {
        bool: {
          minimum_should_match: 1,
          should: [
            { terms: { 'cca_uid.keyword': uids } },
            { terms: { cca_uid: uids } },
          ],
        },
      },
    },
    appConfig,
  );
  const hits = response.body?.hits?.hits || [];
  const Model = registry.resolve[appConfig.resultItemModel.factory];

  return hits.map((hit) => new Model(hit, appConfig));
};
