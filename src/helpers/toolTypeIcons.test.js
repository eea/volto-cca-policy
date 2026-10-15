import {
  getToolTypeIcon,
  getToolTypeIconIcon,
  TOOL_TYPE_ICONS,
} from './toolTypeIcons';

describe('tool type icon utilities', () => {
  it.each([
    ['CLIMATE_DATA_EXPLORER_ATLAS', 'Climate data explorer / atlas'],
    ['HAZARD_RISK_MAP_VIEWER', 'Hazard & risk map viewer'],
    ['MONITORING_EARLY_WARNING', 'Monitoring & early warning'],
    ['RISK_VULNERABILITY_ASSESSMENT', 'Risk & vulnerability assessment'],
    ['PLANNING_DECISION_SUPPORT', 'Planning & decision support'],
    ['MEASURES_KNOWLEDGE_LIBRARY', 'Measures & knowledge library'],
    [
      'SELF_ASSESSMENT_PROGRESS_TRACKING',
      'Self-assessment & progress tracking',
    ],
  ])('maps %s to its circle icon', (token, title) => {
    expect(getToolTypeIconIcon({ tool_type: { token, title } })).toEqual({
      token,
      title,
      icon: TOOL_TYPE_ICONS[token],
    });
  });

  it('uses the token only for lookup and preserves the API title', () => {
    expect(
      getToolTypeIcon({
        tool_type: {
          token: 'HAZARD_RISK_MAP_VIEWER',
          title: 'A changed category title',
        },
      }),
    ).toEqual({
      token: 'HAZARD_RISK_MAP_VIEWER',
      title: 'A changed category title',
    });
  });

  it('reads the Elasticsearch raw title and token shape', () => {
    expect(
      getToolTypeIcon({
        raw: {
          tool_type_title: 'Localized hazard map title',
          tool_type_keyword: 'HAZARD_RISK_MAP_VIEWER',
        },
      }),
    ).toEqual({
      title: 'Localized hazard map title',
      token: 'HAZARD_RISK_MAP_VIEWER',
    });
  });

  it('reads array and internal Elasticsearch result shapes', () => {
    expect(
      getToolTypeIcon({
        _result: {
          raw: {
            tool_type_title: ['Planning & decision support'],
            tool_type_keyword: ['PLANNING_DECISION_SUPPORT'],
          },
        },
      }),
    ).toEqual({
      title: 'Planning & decision support',
      token: 'PLANNING_DECISION_SUPPORT',
    });
  });

  it('returns null for missing and unknown tool types', () => {
    expect(getToolTypeIcon(null)).toBeNull();
    expect(getToolTypeIcon({})).toBeNull();
    expect(getToolTypeIcon({ tool_type: 'UNKNOWN' })).toBeNull();
    expect(getToolTypeIconIcon({ image: '/old-thumbnail.jpg' })).toBeNull();
  });
});
