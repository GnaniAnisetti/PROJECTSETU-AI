/**
 * PROJECTSETU AI - API Service Layer
 * Seamless communication with backend REST endpoints with robust offline fallback.
 */

const API_BASE = 'http://localhost:8080/api';

// Fallback in-memory state in case backend isn't started yet
let localState = {
  projects: [
    {
      id: 'proj-hwy-01',
      code: 'NHAI-PKG-A',
      name: 'Highway Construction – Package A',
      description: '4-Laning of National Highway Corridor Section km 30.000 to km 72.000 including grade separators and minor bridges',
      location: 'NH Infrastructure Corridor, Sector 4-9',
      state: 'Maharashtra',
      corridorLengthKm: 42.0,
      startDate: '2025-04-01',
      plannedEndDate: '2026-11-30',
      revisedEndDate: '2026-12-15',
      budget: 4850000000,
      currency: 'INR',
      status: 'ACTIVE',
      overallPlannedPct: 65.0,
      overallActualPct: 58.0,
      currentVariancePct: -7.0,
      riskLevel: 'WARNING'
    },
    {
      id: 'proj-pipe-02',
      code: 'GAIL-SEC-B',
      name: 'Pipeline Construction – Section B',
      description: 'Cross-state underground natural gas pipeline installation with automatic block valve stations',
      location: 'Northern Energy Corridor, Stretch B',
      state: 'Gujarat',
      corridorLengthKm: 120.0,
      startDate: '2025-06-15',
      plannedEndDate: '2027-02-28',
      revisedEndDate: '2027-03-15',
      budget: 8200000000,
      currency: 'INR',
      status: 'ACTIVE',
      overallPlannedPct: 48.5,
      overallActualPct: 47.0,
      currentVariancePct: -1.5,
      riskLevel: 'ON_TRACK'
    },
    {
      id: 'proj-brg-03',
      code: 'RVR-BRG-C',
      name: 'Bridge Construction – Package C',
      description: 'Construction of 6-lane extra-dosed cable-stayed river viaduct spanning 1,450 meters over major river basin',
      location: 'Riverfront West Viaduct Zone',
      state: 'Assam',
      corridorLengthKm: 1.45,
      startDate: '2024-11-01',
      plannedEndDate: '2026-09-30',
      revisedEndDate: '2026-11-15',
      budget: 3600000000,
      currency: 'INR',
      status: 'ACTIVE',
      overallPlannedPct: 78.0,
      overallActualPct: 71.0,
      currentVariancePct: -7.0,
      riskLevel: 'WARNING'
    }
  ],
  activities: [
    { id: 'act-l5-earth', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.1', level: 'L5', parentId: null, name: 'Earthwork', unit: 'sqm', totalPlannedQty: 420000, plannedProgressPct: 68.0, actualProgressPct: 61.0, variancePct: -7.0, status: 'WARNING' },
    { id: 'act-l5-pave', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.2', level: 'L5', parentId: null, name: 'Pavement', unit: 'meters', totalPlannedQty: 42000, plannedProgressPct: 48.0, actualProgressPct: 42.0, variancePct: -6.0, status: 'WARNING' },
    { id: 'act-l5-struct', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.3', level: 'L5', parentId: null, name: 'Structures', unit: 'cum', totalPlannedQty: 35000, plannedProgressPct: 76.0, actualProgressPct: 74.0, variancePct: -2.0, status: 'ON_TRACK' },
    { id: 'act-l5-drain', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.4', level: 'L5', parentId: null, name: 'Drainage', unit: 'meters', totalPlannedQty: 38000, plannedProgressPct: 58.0, actualProgressPct: 50.0, variancePct: -8.0, status: 'HIGH_RISK' },
    
    { id: 'act-l6-excav', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.1.1', level: 'L6', parentId: 'act-l5-earth', name: 'Excavation', description: 'Roadway cut excavation in all soil & soft rock', chainageStart: '30+000', chainageEnd: '50+000', unit: 'cum', totalPlannedQty: 120000, plannedProgressPct: 70.0, actualProgressPct: 68.0, variancePct: -2.0, status: 'ON_TRACK' },
    { id: 'act-l6-embank', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.1.2', level: 'L6', parentId: 'act-l5-earth', name: 'Embankment Filling', description: 'Earth filling in layers and compaction as per MoRTH', chainageStart: '32+000', chainageEnd: '55+000', unit: 'meters', totalPlannedQty: 95000, plannedProgressPct: 65.0, actualProgressPct: 58.0, variancePct: -7.0, status: 'WARNING' },
    { id: 'act-l6-compact', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.1.3', level: 'L6', parentId: 'act-l5-earth', name: 'Compaction & Proof Rolling', description: 'Vibratory roller compaction to 98% MDD', chainageStart: '32+000', chainageEnd: '55+000', unit: 'meters', totalPlannedQty: 95000, plannedProgressPct: 60.0, actualProgressPct: 55.0, variancePct: -5.0, status: 'WARNING' },

    { id: 'act-l6-subgrade', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.2.1', level: 'L6', parentId: 'act-l5-pave', name: 'Subgrade Preparation', description: 'Top 500mm subgrade preparation with approved borrow soil', chainageStart: '30+000', chainageEnd: '50+000', unit: 'meters', totalPlannedQty: 42000, plannedProgressPct: 50.0, actualProgressPct: 48.0, variancePct: -2.0, status: 'ON_TRACK' },
    { id: 'act-l6-gsb', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.2.2', level: 'L6', parentId: 'act-l5-pave', name: 'Granular Sub-Base (GSB)', description: 'Grading I crushed aggregate layer 200mm thickness', chainageStart: '30+000', chainageEnd: '48+000', unit: 'meters', totalPlannedQty: 40000, plannedProgressPct: 42.0, actualProgressPct: 30.0, variancePct: -12.0, status: 'HIGH_RISK' },
    { id: 'act-l6-wmm', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.2.3', level: 'L6', parentId: 'act-l5-pave', name: 'Wet Mix Macadam (WMM)', description: 'Plant-mixed wet mix macadam base course 250mm', chainageStart: '30+000', chainageEnd: '45+000', unit: 'meters', totalPlannedQty: 38000, plannedProgressPct: 25.0, actualProgressPct: 20.0, variancePct: -5.0, status: 'WARNING' },

    { id: 'act-l6-conc', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.3.1', level: 'L6', parentId: 'act-l5-struct', name: 'Concrete Pouring for Abutment', description: 'M35 grade high performance structural concrete', chainageStart: '34+200', chainageEnd: '34+250', unit: 'cum', totalPlannedQty: 8500, plannedProgressPct: 80.0, actualProgressPct: 78.0, variancePct: -2.0, status: 'ON_TRACK' },
    { id: 'act-l6-pier', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.3.2', level: 'L6', parentId: 'act-l5-struct', name: 'Pier Cap Reinforcement', description: 'Fe550D TMT reinforcement tying and shuttering', chainageStart: '44+100', chainageEnd: '48+900', unit: 'MT', totalPlannedQty: 4200, plannedProgressPct: 75.0, actualProgressPct: 72.0, variancePct: -3.0, status: 'ON_TRACK' },

    { id: 'act-l6-culvert', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.4.1', level: 'L6', parentId: 'act-l5-drain', name: 'Box Culvert Construction', description: 'Precast & cast-in-situ RCC box culverts at crossings', chainageStart: '30+000', chainageEnd: '72+000', unit: 'units', totalPlannedQty: 34, plannedProgressPct: 60.0, actualProgressPct: 48.0, variancePct: -12.0, status: 'HIGH_RISK' },
    { id: 'act-l6-drain-side', projectId: 'proj-hwy-01', wbsCode: 'WBS-1.4.2', level: 'L6', parentId: 'act-l5-drain', name: 'Longitudinal Side Drains', description: 'Trapezoidal concrete roadside drains for storm runoff', chainageStart: '30+000', chainageEnd: '72+000', unit: 'meters', totalPlannedQty: 28000, plannedProgressPct: 45.0, actualProgressPct: 45.0, variancePct: 0.0, status: 'ON_TRACK' }
  ],
  alerts: [
    {
      id: 'alt-001',
      projectId: 'proj-hwy-01',
      activityId: 'act-l6-embank',
      activityName: 'L6 – Embankment Filling',
      severity: 'WARNING',
      title: 'Embankment Filling Schedule Variance (-7.0%)',
      message: 'Actual progress (58%) is lagging planned (65%). Work stoppage & subgrade moisture detected.',
      varianceValue: -7.0,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isAcknowledged: false
    },
    {
      id: 'alt-002',
      projectId: 'proj-hwy-01',
      activityId: 'act-l6-gsb',
      activityName: 'L6 – Granular Sub-Base (GSB)',
      severity: 'HIGH_RISK',
      title: 'Critical Aggregate Supply Deficit (-12.0%)',
      message: 'GSB delayed due to commercial quarry environmental licensing bottleneck.',
      varianceValue: -12.0,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isAcknowledged: false
    }
  ],
  recommendations: [
    {
      id: 'rec-001',
      alertId: 'alt-001',
      activityId: 'act-l6-embank',
      activityName: 'L6 – Embankment Filling',
      title: 'Reallocate Earthmoving Fleet to Dry Rock-Cut Front',
      suggestedAction: '1. Divert 2 hydraulic excavators & 4 tippers from wet section (Ch 34+500) to dry rock-cut front at Ch 42+000.\n2. Deploy high-capacity aerator discs on Ch 34+800 to accelerate soil dry-back.\n3. Extend twilight dry-back rolling shift by 2.5 hours once moisture drops within +/-1% of OMC.',
      technicalJustification: 'Accelerating dry-zone cut prevents machine idling while natural insolation reduces subgrade moisture without chemical stabilization.',
      expectedDelayReductionDays: 1.5,
      expectedCostImpact: 18500,
      expectedResourceImpact: '+14% Fleet Productivity, 2 Excavators relocated',
      priority: 'HIGH',
      status: 'PENDING'
    },
    {
      id: 'rec-002',
      alertId: 'alt-002',
      activityId: 'act-l6-gsb',
      activityName: 'L6 – Granular Sub-Base (GSB)',
      title: 'Mobilize Secondary Aggregate Quarry Supplier',
      suggestedAction: 'Authorize emergency commercial draw from secondary approved quarry at Ch 58+000 to bridge 200 TPD supply gap.',
      technicalJustification: 'Direct bypass of environmental clearance delay at primary crusher pit.',
      expectedDelayReductionDays: 4.0,
      expectedCostImpact: 65000,
      expectedResourceImpact: '+200 MT/day aggregate hauling trucks',
      priority: 'URGENT',
      status: 'PENDING'
    }
  ],
  auditTrail: [
    { id: 'aud-001', user: 'Rajesh Sharma (Field Eng)', action: 'DPR_SUBMITTED', entity: 'Daily Report Ch 34+500', prev: null, next: '700m Earth filling submitted', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'aud-002', user: 'Vikram Rathore (Admin)', action: 'THRESHOLD_UPDATED', entity: 'System Config', prev: 'Warning: -6%', next: 'Warning: -5%', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'aud-003', user: 'Priya Nair (Project Mgr)', action: 'AI_MATCH_CONFIRMED', entity: 'Activity Match', prev: 'L6 - Excavation (68%)', next: 'L6 - Embankment Filling (94%)', timestamp: new Date(Date.now() - 86400000).toISOString() }
  ],
  thresholds: { warning: -5.0, critical: -10.0 }
};

async function fetchWithFallback(url, options, fallbackFn) {
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`HTTP error ${res.status}`);
  } catch (err) {
    console.warn(`[ProjectSetu API] Falling back to local state for ${url}:`, err.message);
    return fallbackFn();
  }
}

export const api = {
  // Auth
  login: async (email, role) => {
    return fetchWithFallback(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      },
      () => {
        const users = {
          FIELD_ENGINEER: { id: 'usr-eng-01', email: 'engineer@hexora.in', role: 'FIELD_ENGINEER', fullName: 'Rajesh Sharma', designation: 'Senior Site Engineer', org: 'NHAI PIU Nagpur' },
          PROJECT_MANAGER: { id: 'usr-mgr-02', email: 'manager@hexora.in', role: 'PROJECT_MANAGER', fullName: 'Priya Nair', designation: 'Project Director & Authority Engineer', org: 'NHAI Regional Office' },
          CITIZEN: { id: 'usr-cit-03', email: 'citizen@hexora.in', role: 'CITIZEN', fullName: 'Amit Patel', designation: 'Citizen Observer', org: 'Nagrik Transparency Forum' },
          ADMIN: { id: 'usr-adm-04', email: 'admin@hexora.in', role: 'ADMIN', fullName: 'Vikram Rathore', designation: 'Principal Systems Administrator', org: 'MoRTH Project Control Center' }
        };
        const u = users[role] || users.PROJECT_MANAGER;
        return { status: 'SUCCESS', token: 'mock-jwt-token', user: u };
      }
    );
  },

  // Projects
  getProjects: async () => {
    return fetchWithFallback(
      `${API_BASE}/projects`,
      {},
      () => ({ status: 'SUCCESS', projects: localState.projects })
    );
  },

  getProjectActivities: async (projectId) => {
    return fetchWithFallback(
      `${API_BASE}/projects/${projectId}/activities`,
      {},
      () => ({ status: 'SUCCESS', activities: localState.activities.filter(a => a.projectId === projectId) })
    );
  },

  // Ingest data
  submitSiteData: async (payload) => {
    return fetchWithFallback(
      `${API_BASE}/data/input`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => ({ status: 'SUCCESS', documentId: `doc-${Date.now()}`, message: 'Ingested locally' })
    );
  },

  // AI Extraction
  extractEntities: async (rawText) => {
    return fetchWithFallback(
      `${API_BASE}/data/extract`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      },
      () => {
        const isRain = /rain|rainfall|monsoon/i.test(rawText);
        return {
          status: 'SUCCESS',
          extracted: {
            id: `ext-${Date.now()}`,
            activity: 'Earth filling',
            activity_type: 'Embankment Formation',
            location: '34+500 to 35+200',
            quantity: 700,
            unit: 'meters',
            completion: 100,
            status: 'completed',
            delay_hours: isRain ? 2.0 : 0.0,
            delay_reason: isRain ? 'Heavy rainfall and saturated subsoil' : null,
            weather_condition: isRain ? 'Heavy Rainfall (38mm/hr)' : 'Clear / Sunny',
            manpower: 24,
            equipment: ['Hydraulic Excavator CAT 320D', 'Tippers (4 Nos)', 'Vibratory Roller'],
            source: 'daily_site_report',
            confidence: 94.0,
            timestamp: new Date().toISOString()
          }
        };
      }
    );
  },

  // Semantic Matching
  matchActivity: async (extractedEvent) => {
    return fetchWithFallback(
      `${API_BASE}/activity/match`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractedEvent })
      },
      () => ({
        status: 'SUCCESS',
        matchResult: {
          topMatch: {
            activityId: 'act-l6-embank',
            wbsCode: 'WBS-1.1.2',
            level: 'L6',
            name: 'Embankment Filling',
            plannedProgress: 65.0,
            actualProgress: 58.0,
            similarityScore: 94.0,
            unit: 'meters'
          },
          alternatives: [
            { activityId: 'act-l6-excav', wbsCode: 'WBS-1.1.1', level: 'L6', name: 'Excavation', plannedProgress: 70.0, actualProgress: 68.0, similarityScore: 68.0 },
            { activityId: 'act-l6-subgrade', wbsCode: 'WBS-1.2.1', level: 'L6', name: 'Subgrade Preparation', plannedProgress: 50.0, actualProgress: 48.0, similarityScore: 52.0 },
            { activityId: 'act-l6-compact', wbsCode: 'WBS-1.1.3', level: 'L6', name: 'Compaction & Proof Rolling', plannedProgress: 60.0, actualProgress: 55.0, similarityScore: 64.0 }
          ],
          confidenceScore: 94.0,
          isHighConfidence: true,
          tier: 'HIGH CONFIDENCE',
          explanation: "Matched because 'earth filling' is semantically equivalent to 'Embankment Filling' in MoRTH WBS civil engineering standards and the reported chainage overlaps with active corridor."
        }
      })
    );
  },

  // Human Validation
  validateRecord: async (payload) => {
    return fetchWithFallback(
      `${API_BASE}/validation`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => {
        localState.auditTrail.unshift({
          id: `aud-${Date.now()}`,
          user: payload.validatedBy || 'Project Authority',
          action: `VALIDATION_${payload.action}`,
          entity: 'WBS_ACTIVITY_PROGRESS',
          prev: 'Pending Validation',
          next: `${payload.action}: ${payload.activityName}`,
          timestamp: new Date().toISOString()
        });
        return { status: 'SUCCESS', action: payload.action };
      }
    );
  },

  // Update Actual Progress
  updateProgress: async (payload) => {
    return fetchWithFallback(
      `${API_BASE}/progress/update`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => {
        const act = localState.activities.find(a => a.id === payload.activityId) || localState.activities[5];
        act.actualProgressPct = payload.actualProgressPct !== undefined ? payload.actualProgressPct : 58.0;
        act.variancePct = Number((act.actualProgressPct - act.plannedProgressPct).toFixed(1));
        act.status = 'WARNING';

        const alert = {
          id: `alt-${Date.now()}`,
          projectId: act.projectId,
          activityId: act.id,
          activityName: act.name,
          severity: 'WARNING',
          title: `Schedule Variance Detected in ${act.name} (${act.variancePct}%)`,
          message: `Actual progress (${act.actualProgressPct}%) is lagging planned (${act.plannedProgressPct}%). Variance breaches threshold.`,
          varianceValue: act.variancePct,
          timestamp: new Date().toISOString(),
          isAcknowledged: false
        };
        localState.alerts.unshift(alert);

        return { status: 'SUCCESS', activity: act, alertGenerated: alert };
      }
    );
  },

  // Compare Progress
  getProgressComparison: async (projectId) => {
    return fetchWithFallback(
      `${API_BASE}/progress/compare?projectId=${projectId || 'proj-hwy-01'}`,
      {},
      () => ({
        status: 'SUCCESS',
        project: localState.projects[0],
        activities: localState.activities.filter(a => a.level === 'L6'),
        sCurveData: [
          { week: 'W1', planned: 10, actual: 10, variance: 0 },
          { week: 'W2', planned: 18, actual: 18, variance: 0 },
          { week: 'W3', planned: 28, actual: 27, variance: -1 },
          { week: 'W4', planned: 38, actual: 36, variance: -2 },
          { week: 'W5', planned: 47, actual: 44, variance: -3 },
          { week: 'W6', planned: 55, actual: 51, variance: -4 },
          { week: 'W7', planned: 60, actual: 55, variance: -5 },
          { week: 'W8 (Current)', planned: 65, actual: 58, variance: -7 },
          { week: 'W9', planned: 72, actual: null, forecast: 64 },
          { week: 'W10', planned: 80, actual: null, forecast: 71 },
          { week: 'W11', planned: 90, actual: null, forecast: 82 },
          { week: 'W12', planned: 100, actual: null, forecast: 93 }
        ],
        overallPlanned: 65.0,
        overallActual: 58.0,
        variance: -7.0
      })
    );
  },

  // Alerts & Root Cause
  getAlerts: async () => {
    return fetchWithFallback(
      `${API_BASE}/alerts`,
      {},
      () => ({ status: 'SUCCESS', alerts: localState.alerts })
    );
  },

  getRootCause: async (alertId) => {
    return fetchWithFallback(
      `${API_BASE}/root-causes/${alertId}`,
      {},
      () => ({
        status: 'SUCCESS',
        rootCause: {
          alertId,
          primaryCause: 'Unseasonal Heavy Rainfall & Saturated Soil (OMC Exceeded)',
          contributingFactors: [
            '2.0 hours direct operational stoppage caused by stormfront',
            'Subgrade soil moisture exceeded Optimum Moisture Content (OMC) by +4.2%',
            'Vibratory roller compaction slippage on uncompacted fill slope',
            'Haul road muddy conditions reducing dumper turnaround cycle by 35%'
          ],
          weatherData: '38mm precipitation recorded at Site Camp AWS #2',
          equipmentDowntimeHrs: 2.0,
          manpowerImpact: 'Idle period for 18 laborers during rainfall',
          soilCondition: 'Saturated Clayey Silt (OMC +4.2%)',
          analysisConfidence: 94.2
        }
      })
    );
  },

  // Recommendations
  getRecommendations: async () => {
    return fetchWithFallback(
      `${API_BASE}/recommendations`,
      {},
      () => ({ status: 'SUCCESS', recommendations: localState.recommendations })
    );
  },

  actOnRecommendation: async (recommendationId, actionType, userModifications) => {
    return fetchWithFallback(
      `${API_BASE}/recommendations/action`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId, actionType, userModifications })
      },
      () => {
        const rec = localState.recommendations.find(r => r.id === recommendationId);
        if (rec) rec.status = actionType;
        return { status: 'SUCCESS', recommendation: rec };
      }
    );
  },

  // Feedback
  submitFeedback: async (payload) => {
    return fetchWithFallback(
      `${API_BASE}/feedback`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => ({ status: 'SUCCESS', message: 'Feedback stored' })
    );
  },

  // Learning & Analytics
  getLearningData: async () => {
    return fetchWithFallback(
      `${API_BASE}/learning`,
      {},
      () => ({
        status: 'SUCCESS',
        modelStats: {
          initialAccuracy: 86.2,
          currentAccuracy: 93.8,
          accuracyGain: '+7.6%',
          totalFieldReportsProcessed: 1420,
          validatedMatchesCount: 1380,
          userCorrectionRate: '6.2%',
          evolutionData: [
            { month: 'Apr 2025', accuracy: 86.2, samples: 120 },
            { month: 'May 2025', accuracy: 87.5, samples: 210 },
            { month: 'Jun 2025', accuracy: 89.1, samples: 340 },
            { month: 'Jul 2025', accuracy: 91.0, samples: 290 },
            { month: 'Aug 2025', accuracy: 92.4, samples: 310 },
            { month: 'Sep 2025', accuracy: 93.8, samples: 150 }
          ]
        }
      })
    );
  },

  getAnalytics: async () => {
    return fetchWithFallback(
      `${API_BASE}/analytics`,
      {},
      () => ({
        status: 'SUCCESS',
        riskDistribution: [
          { name: 'On Track', value: 8, color: '#10B981' },
          { name: 'Warning (-5% to -10%)', value: 4, color: '#F59E0B' },
          { name: 'High Risk (<-10%)', value: 2, color: '#EF4444' }
        ],
        confidenceDistribution: [
          { tier: '90% - 100% (High)', count: 85, color: '#3B82F6' },
          { tier: '75% - 89% (Medium)', count: 12, color: '#6366F1' },
          { tier: '< 75% (Low)', count: 3, color: '#EC4899' }
        ],
        recommendationAcceptance: [
          { name: 'Accepted', value: 78, color: '#10B981' },
          { name: 'Modified', value: 16, color: '#F59E0B' },
          { name: 'Rejected', value: 6, color: '#EF4444' }
        ],
        monthlyDelayHours: [
          { month: 'Apr', weather: 8, equipment: 4, material: 2 },
          { month: 'May', weather: 14, equipment: 6, material: 4 },
          { month: 'Jun', weather: 32, equipment: 8, material: 6 },
          { month: 'Jul', weather: 45, equipment: 10, material: 8 },
          { month: 'Aug', weather: 28, equipment: 5, material: 5 },
          { month: 'Sep', weather: 16, equipment: 3, material: 2 }
        ]
      })
    );
  },

  getReports: async () => {
    return fetchWithFallback(
      `${API_BASE}/reports`,
      {},
      () => ({
        status: 'SUCCESS',
        availableReports: [
          { id: 'rep-01', title: 'Daily Progress Report (DPR) - Ch 30 to 72', date: '2026-09-11', type: 'DPR', status: 'Generated' },
          { id: 'rep-02', title: 'Weekly Schedule Variance & S-Curve Analysis', date: '2026-09-08', type: 'Weekly', status: 'Generated' },
          { id: 'rep-03', title: 'MoRTH Delay & Root-Cause Audit Register', date: '2026-09-05', type: 'Delay', status: 'Generated' },
          { id: 'rep-04', title: 'AI Mitigation & Recommendation Action Summary', date: '2026-09-01', type: 'Mitigation', status: 'Generated' }
        ]
      })
    );
  },

  // Forecast & What-If
  getForecast: async () => {
    return fetchWithFallback(
      `${API_BASE}/forecast`,
      {},
      () => ({
        status: 'SUCCESS',
        baselineCompletionDate: '2026-11-30',
        currentPacedCompletionDate: '2026-12-14',
        forecastedDelayDays: 14,
        highRiskActivitiesCount: 2,
        scenarios: [
          { id: 'A', name: 'Baseline (Current Pace)', completionDate: '2026-12-14', delayDays: 14, costDelta: 0, requiredWorkforce: 140 },
          { id: 'B', name: 'Scenario B (+2 Excavators & Twilight Shift)', completionDate: '2026-12-02', delayDays: 2, costDelta: 320000, requiredWorkforce: 156 },
          { id: 'C', name: 'Scenario C (Fast-Track: Secondary Quarry + Fleet Boost)', completionDate: '2026-11-28', delayDays: -2, costDelta: 780000, requiredWorkforce: 172 }
        ]
      })
    );
  },

  simulateWhatIf: async (payload) => {
    return fetchWithFallback(
      `${API_BASE}/forecast/what-if`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => {
        const workers = Number(payload.additionalWorkers || 0);
        const excavators = Number(payload.additionalExcavators || 0);
        const shiftHrs = Number(payload.extendShiftHours || 0);
        const boost = (workers * 0.02) + (excavators * 0.08) + (shiftHrs * 0.05);
        const recovered = Math.min(20, Math.round(14 * (boost / (1 + boost))));
        const delay = Math.max(-4, 14 - recovered);
        return {
          status: 'SUCCESS',
          simulation: {
            productivityBoostPct: Math.round(boost * 100),
            recoveredDays: recovered,
            revisedDelayDays: delay,
            revisedCompletionDate: '2026-12-02',
            estimatedCostImpact: (workers * 25000) + (excavators * 140000) + (shiftHrs * 40000)
          }
        };
      }
    );
  },

  // Admin & Audit
  getAuditTrail: async () => {
    return fetchWithFallback(
      `${API_BASE}/audit-trail`,
      {},
      () => ({ status: 'SUCCESS', auditTrail: localState.auditTrail })
    );
  },

  getThresholds: async () => {
    return fetchWithFallback(
      `${API_BASE}/config/thresholds`,
      {},
      () => ({ status: 'SUCCESS', thresholds: localState.thresholds })
    );
  },

  updateThresholds: async (payload) => {
    return fetchWithFallback(
      `${API_BASE}/config/thresholds`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => {
        localState.thresholds = { ...localState.thresholds, ...payload };
        return { status: 'SUCCESS', thresholds: localState.thresholds };
      }
    );
  }
};
