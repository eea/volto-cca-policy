import climateDataExplorerIcon from '../icons/navigator/01_climate-data-explorer_circle.svg';
import hazardRiskMapViewerIcon from '../icons/navigator/02_hazard-risk-map-viewer_circle.svg';
import monitoringEarlyWarningIcon from '../icons/navigator/03_monitoring-early-warning_circle.svg';
import riskVulnerabilityAssessmentIcon from '../icons/navigator/04_risk-vulnerability-assessment_circle.svg';
import planningDecisionSupportIcon from '../icons/navigator/05_planning-decision-support_circle.svg';
import measuresKnowledgeLibraryIcon from '../icons/navigator/06_measures-knowledge-library_circle.svg';
import selfAssessmentTrackingIcon from '../icons/navigator/07_self-assessment-tracking_circle.svg';

export const TOOL_TYPE_ICONS = {
  CLIMATE_DATA_EXPLORER_ATLAS: climateDataExplorerIcon,
  HAZARD_RISK_MAP_VIEWER: hazardRiskMapViewerIcon,
  MONITORING_EARLY_WARNING: monitoringEarlyWarningIcon,
  RISK_VULNERABILITY_ASSESSMENT: riskVulnerabilityAssessmentIcon,
  PLANNING_DECISION_SUPPORT: planningDecisionSupportIcon,
  MEASURES_KNOWLEDGE_LIBRARY: measuresKnowledgeLibraryIcon,
  SELF_ASSESSMENT_PROGRESS_TRACKING: selfAssessmentTrackingIcon,
};

const unwrapRawValue = (value) => {
  let unwrapped = value;

  while (
    unwrapped &&
    typeof unwrapped === 'object' &&
    !Array.isArray(unwrapped) &&
    Object.prototype.hasOwnProperty.call(unwrapped, 'raw')
  ) {
    unwrapped = unwrapped.raw;
  }

  return Array.isArray(unwrapped) ? unwrapped[0] : unwrapped;
};

export function getToolTypeIcon(result) {
  if (!result) return null;

  const source = unwrapRawValue(result._result || result);
  const rawToken = unwrapRawValue(
    result.tool_type_keyword || source?.tool_type_keyword,
  );
  const rawTitle = unwrapRawValue(
    result.tool_type_title || source?.tool_type_title,
  );
  const value = unwrapRawValue(
    result.tool_type ||
      result.cca_tool_type ||
      source?.tool_type ||
      source?.cca_tool_type,
  );

  const token =
    rawToken ||
    (typeof value === 'string' ? value : value?.token || value?.value);
  if (!TOOL_TYPE_ICONS[token]) return null;

  return {
    token,
    title:
      rawTitle ||
      (typeof value?.title === 'string' && value.title ? value.title : token),
  };
}

export function getToolTypeIconIcon(result) {
  const toolType = getToolTypeIcon(result);
  if (!toolType) return null;

  return {
    ...toolType,
    icon: TOOL_TYPE_ICONS[toolType.token],
  };
}
