import React, { useState, useEffect } from 'react';
import { 
  AlertItem, 
  AuditLogEntry, 
  CameraSensor, 
  ComplaintInput, 
  DashboardStats, 
  InvestigationTimelineStep, 
  PredictedLocation, 
  TabType, 
  UserProfile,
  HumanVerificationDecision,
  HumanVerificationRecord
} from './types';
import { 
  AVAILABLE_USERS, 
  INITIAL_ALERTS, 
  INITIAL_AUDIT_LOG as INITIAL_AUDIT_LOGS, 
  INITIAL_CAMERA_SENSORS, 
  INITIAL_TIMELINE, 
  TAMIL_NADU_ATMS 
} from './data/mockData';
import { CommandCenter } from './components/CommandCenter';
import { CaseInputPredictor } from './components/CaseInputPredictor';
import { ExplainableAiPanel } from './components/ExplainableAiPanel';
import { CameraSensorModule } from './components/CameraSensorModule';
import { HumanVerificationPanel } from './components/HumanVerificationPanel';
import { AlertEngine } from './components/AlertEngine';
import { InvestigationTimeline } from './components/InvestigationTimeline';
import { WhatIfSimulation } from './components/WhatIfSimulation';
import { AnalyticsView } from './components/AnalyticsView';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { ReportModal } from './components/ReportModal';
import { SIH_DEMO_STEPS, SihDemoController } from './components/SihDemoController';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { GisMapDashboard } from './components/GisMapDashboard';
import { calculateBlockHash, generateOfficerSignature } from './utils/cryptoUtils';
import { 
  IntelligenceScenarioId, 
  INTELLIGENCE_SCENARIOS 
} from './utils/riskEngine';

export default function App() {
  // Navigation & User State - defaults to GIS_MAP for immediate user display
  const [activeTab, setActiveTab] = useState<TabType>('GIS_MAP');
  const [currentUser, setCurrentUser] = useState<UserProfile>(AVAILABLE_USERS[0]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // SIH Step & Deterministic Intelligence Scenario State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeScenarioId, setActiveScenarioId] = useState<IntelligenceScenarioId>('BASELINE_FLAGSHIP');
  const [isRefreshingRisk, setIsRefreshingRisk] = useState<boolean>(false);

  // Core Data States
  const [locations, setLocations] = useState<PredictedLocation[]>(TAMIL_NADU_ATMS);
  const [selectedLocation, setSelectedLocation] = useState<PredictedLocation | null>(TAMIL_NADU_ATMS[0]);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [sensors, setSensors] = useState<CameraSensor[]>(INITIAL_CAMERA_SENSORS);
  const [timeline, setTimeline] = useState<InvestigationTimelineStep[]>(INITIAL_TIMELINE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Human Verification State
  const [verificationRecord, setVerificationRecord] = useState<HumanVerificationRecord | null>({
    decision: 'CONFIRM',
    officerName: AVAILABLE_USERS[0].name,
    badgeNumber: AVAILABLE_USERS[0].badgeNumber,
    designation: AVAILABLE_USERS[0].designation,
    timestamp: '2026-09-09 19:42:15 IST',
    justification: 'All 4 evidentiary quadrants affirmatively verified. Mule layering velocity, geographic isolation of Beach Road kiosk, and sensor loitering pattern justify immediate P1 operational interception order.',
    reviewedItems: {
      transactionLayering: true,
      crossCaseCorrelation: true,
      gisHotspotRisk: true,
      cameraSensorTelemetry: true
    },
    signatureHash: 'SIG-TN-VERIFY-78A9C1',
    status: 'VERIFIED'
  });

  // Prediction State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [demoRiskScore, setDemoRiskScore] = useState<number | null>(92);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(89);
  const [predictionWindow, setPredictionWindow] = useState<string | null>('20:00 – 22:00 IST');
  const [aiAnalysisSummary, setAiAnalysisSummary] = useState<string>('');

  // Sensor Scanning State
  const [isScanningSensors, setIsScanningSensors] = useState<boolean>(false);

  // Report Modal State
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportAlert, setReportAlert] = useState<AlertItem | null>(null);

  // Load initial backend statistics
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 2481,
    activeAlerts: 4,
    highRiskLocationsCount: 5,
    predictedWithdrawalsCount: 142,
    avgConfidence: 87,
    preventedLossTotal: '₹4.28 Cr'
  });

  // Fetch initial API stats if backend is ready
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        // Silently use realistic synthetic default stats
      });
  }, []);

  // Handler: Add entry to non-repudiable hash-chained audit ledger
  const addAuditEntry = (action: string, resource: string, details: string) => {
    setAuditLogs(prev => {
      const prevHead = prev[0];
      const blockHeight = (prevHead?.blockHeight || prev.length) + 1;
      const prevHash = prevHead?.hash || '0000000000000000000000000000000000000000000000000000000000000000';
      const timestamp = new Date().toLocaleTimeString('en-GB') + ' IST';
      const hash = calculateBlockHash(
        blockHeight,
        prevHash,
        timestamp,
        currentUser.name,
        action,
        resource,
        details
      );
      const signature = generateOfficerSignature(currentUser.badgeNumber, hash);

      const newEntry: AuditLogEntry = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        blockHeight,
        timestamp,
        officerName: currentUser.name,
        badgeNumber: currentUser.badgeNumber,
        action,
        resource,
        details,
        ipAddress: '10.142.8.21 (TN-POLICE-VPN)',
        hash,
        prevHash,
        signature
      };
      return [newEntry, ...prev];
    });
  };

  // Handler: Analyze & Predict Case
  const handleAnalyzeComplaint = async (input: ComplaintInput) => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint: input, officer: currentUser })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.predictedLocations && data.predictedLocations.length > 0) {
          setLocations(data.predictedLocations);
          setSelectedLocation(data.predictedLocations[0]);
        }
        if (data.overallRiskScore) setDemoRiskScore(data.overallRiskScore);
        if (data.confidenceScore) setConfidenceScore(data.confidenceScore);
        if (data.predictionWindow) setPredictionWindow(data.predictionWindow);
        if (data.aiAnalysis) setAiAnalysisSummary(data.aiAnalysis);

        setStats(prev => ({
          ...prev,
          totalComplaints: prev.totalComplaints + 1,
          predictedWithdrawalsCount: prev.predictedWithdrawalsCount + 3
        }));

        addAuditEntry(
          'ANALYZE_COMPLAINT',
          input.accountRef,
          `Ingested ${input.complaintType} for ₹${input.amount}. Predicted ${data.predictedLocations?.length || 5} candidate ATM hubs.`
        );
      } else {
        fallbackPredict(input);
      }
    } catch {
      fallbackPredict(input);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fallback prediction algorithm
  const fallbackPredict = (input: ComplaintInput) => {
    const isCoastal = input.region.toLowerCase().includes('nagapattinam');
    const calculatedRisk = isCoastal ? 94 : Math.min(95, Math.max(55, Math.round((input.amount / 5000) * 0.9 + 40)));

    const reordered = [...locations].map((loc, idx) => {
      const isTarget = loc.region.toLowerCase().includes(input.region.toLowerCase());
      const score = isTarget ? Math.min(98, calculatedRisk - idx * 2) : Math.max(30, loc.riskScore - 15);
      return {
        ...loc,
        riskScore: score,
        riskLevel: score >= 75 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW',
        confidence: Math.min(94, Math.max(70, score - 3))
      } as PredictedLocation;
    }).sort((a, b) => b.riskScore - a.riskScore);

    setLocations(reordered);
    setSelectedLocation(reordered[0]);
    setDemoRiskScore(calculatedRisk);
    setConfidenceScore(89);
    setPredictionWindow(input.expectedWithdrawalTime);

    addAuditEntry(
      'ANALYZE_COMPLAINT_LOCAL',
      input.accountRef,
      `Calculated dynamic risk score ${calculatedRisk}% for ${input.region}.`
    );
  };

  // Handler: Scan Authorized Cameras
  const handleScanCameras = async () => {
    setIsScanningSensors(true);

    try {
      const res = await fetch('/api/cameras/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officer: currentUser })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.sensors) {
          setSensors(data.sensors);
        }
      } else {
        setSensors(prev => prev.map(s => ({
          ...s,
          lastScanTime: 'Just now (live)',
          status: 'ONLINE'
        })));
      }

      addAuditEntry(
        'SCAN_CAMERAS',
        'PERIMETER_SENSORS_TN',
        `Completed privacy-compliant telemetry scan across ${sensors.length} public sensor feeds.`
      );
    } catch {
      setSensors(prev => prev.map(s => ({
        ...s,
        lastScanTime: 'Just now (live)'
      })));
    } finally {
      setIsScanningSensors(false);
    }
  };

  // Handler: Human Verification Decision
  const handleVerificationDecision = (
    decision: HumanVerificationDecision,
    justification: string,
    checklist: {
      transactionLayering: boolean;
      crossCaseCorrelation: boolean;
      gisHotspotRisk: boolean;
      cameraSensorTelemetry: boolean;
    }
  ) => {
    const isApproved = decision === 'CONFIRM';
    const status = isApproved ? 'VERIFIED' : decision === 'REJECT' ? 'REJECTED' : 'ESCALATED';

    const newRecord: HumanVerificationRecord = {
      decision,
      officerName: currentUser.name,
      badgeNumber: currentUser.badgeNumber,
      designation: currentUser.designation,
      timestamp: new Date().toLocaleTimeString('en-GB') + ' IST',
      justification,
      reviewedItems: checklist,
      signatureHash: `SIG-TN-${currentUser.badgeNumber.slice(-4)}-${Date.now().toString().slice(-4)}`,
      status
    };

    setVerificationRecord(newRecord);

    if (isApproved) {
      // Create or upgrade P1 Alert
      const p1Alert: AlertItem = {
        id: `alert-p1-${Date.now().toString().slice(-4)}`,
        alertCode: 'ALERT-CRIT-9901',
        atmId: selectedLocation?.atmCode || 'ATM-NGP-001',
        atmName: selectedLocation?.name || 'Nagapattinam Port Coastal ATM Kiosk',
        riskScore: selectedLocation?.riskScore || 92,
        expectedWindow: selectedLocation?.predictedWindow || '20:00 – 22:00 IST',
        timestamp: new Date().toLocaleTimeString('en-GB') + ' IST',
        amount: 350000,
        priority: 'CRITICAL',
        status: 'DISPATCHED',
        region: selectedLocation?.region || 'Nagapattinam',
        caseRef: 'CYB-TN-2026-8891',
        notes: `P1 Alert verified & authorized by ${currentUser.name} (${currentUser.badgeNumber}). QRT tactical team dispatched.`
      };

      setAlerts(prev => [p1Alert, ...prev.filter(a => a.id !== p1Alert.id)]);
      
      // Advance timeline step to Dispatch
      setTimeline(prev => prev.map(s => {
        if (s.id === 'step-5') return { ...s, status: 'COMPLETED' };
        if (s.id === 'step-6') return { ...s, status: 'IN_PROGRESS' };
        return s;
      }));

      addAuditEntry(
        'HUMAN_VERIFICATION_CONFIRMED',
        selectedLocation?.atmCode || 'ATM-NGP-001',
        `Officer ${currentUser.name} verified all 4 evidence quadrants and sanctioned P1 Tactical Interception.`
      );

      setActiveTab('ALERTS');
    } else {
      addAuditEntry(
        `HUMAN_VERIFICATION_${decision}`,
        selectedLocation?.atmCode || 'ATM-NGP-001',
        `Investigator ${currentUser.name} recorded decision ${decision}: ${justification}`
      );
    }
  };

  // Handler: Alert Action (Acknowledge, Investigate, Dispatch, Resolve)
  const handleAlertAction = async (
    alertId: string, 
    action: 'ACKNOWLEDGE' | 'INVESTIGATE' | 'DISPATCH' | 'RESOLVE' | 'ESCALATE'
  ) => {
    const statusMap = {
      ACKNOWLEDGE: 'ACKNOWLEDGED' as const,
      INVESTIGATE: 'INVESTIGATING' as const,
      DISPATCH: 'DISPATCHED' as const,
      RESOLVE: 'RESOLVED' as const,
      ESCALATE: 'INVESTIGATING' as const
    };

    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: statusMap[action],
          notes: `${a.notes || ''} [${new Date().toLocaleTimeString()} by ${currentUser.name}: ${action}]`
        };
      }
      return a;
    }));

    addAuditEntry(
      `ALERT_${action}`,
      alertId,
      `Officer ${currentUser.name} executed ${action} on alert ${alertId}.`
    );
  };

  // Handler: Open Report Modal
  const handleOpenReport = (alert?: AlertItem, location?: PredictedLocation) => {
    if (alert) {
      setReportAlert(alert);
      const matched = locations.find(l => l.atmCode === alert.atmId);
      if (matched) setSelectedLocation(matched);
    } else if (location) {
      setSelectedLocation(location);
      const matchedAlert = alerts.find(a => a.atmId === location.atmCode) || null;
      setReportAlert(matchedAlert);
    }
    setIsReportOpen(true);
  };

  // Handler: Focus ATM on Map
  const handleFocusLocationOnMap = (atmId: string) => {
    const found = locations.find(l => l.atmCode === atmId);
    if (found) {
      setSelectedLocation(found);
    }
    setActiveTab('GIS_MAP');
  };

  // Handler: What-If simulation apply
  const handleApplySimulation = (simulatedLocs: PredictedLocation[], simulatedRisk: number) => {
    setLocations(simulatedLocs);
    setSelectedLocation(simulatedLocs[0]);
    setDemoRiskScore(simulatedRisk);
    setActiveTab('COMMAND_CENTER');

    addAuditEntry(
      'SIMULATION_APPLIED',
      'TACTICAL_SANDBOX',
      `Applied dynamic what-if simulation with top risk node: ${simulatedLocs[0].name} (${simulatedRisk}%).`
    );
  };

  // Handler: Advance Timeline Step
  const handleAdvanceTimelineStep = () => {
    setTimeline(prev => {
      const next = [...prev];
      const inProgIdx = next.findIndex(s => s.status === 'IN_PROGRESS');
      if (inProgIdx !== -1) {
        next[inProgIdx].status = 'COMPLETED';
        if (inProgIdx + 1 < next.length) {
          next[inProgIdx + 1].status = 'IN_PROGRESS';
        }
      }
      return next;
    });

    addAuditEntry(
      'TIMELINE_ADVANCE',
      'INVESTIGATION_WORKFLOW',
      `Advanced tactical investigation pipeline to next sequential checkpoint.`
    );
  };

  // Handler: Simulate Tamper on an Audit Block for Judges
  const handleToggleTamperSimulation = (blockId: string) => {
    setAuditLogs(prev => prev.map(log => {
      if (log.id === blockId || log.blockHeight === 3) {
        return {
          ...log,
          isTampered: !log.isTampered,
          details: log.isTampered 
            ? 'Executed AI predictive analytics algorithm on ₹3,50,000 investment fraud complaint.' 
            : '[UNAUTHORIZED_ALTERATION] Risk score reduced to 10% to suppress police dispatch.'
        };
      }
      return log;
    }));
  };

  // Handler: Restore Audit Chain
  const handleRestoreChain = () => {
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  // Handler: Select Scenario
  const handleSelectScenario = (scenarioId: IntelligenceScenarioId) => {
    setActiveScenarioId(scenarioId);
    setIsRefreshingRisk(true);
    setTimeout(() => {
      const scenario = INTELLIGENCE_SCENARIOS[scenarioId];
      const result = scenario.apply(locations);
      setLocations(result.updatedLocations);
      setSelectedLocation(result.updatedLocations[0]);
      setStats(prev => ({
        ...prev,
        totalComplaints: prev.totalComplaints + result.kpiDelta.complaintsDelta,
        activeAlerts: Math.max(1, prev.activeAlerts + result.kpiDelta.alertsDelta),
        highRiskLocationsCount: Math.max(1, prev.highRiskLocationsCount + result.kpiDelta.highRiskDelta),
        predictedWithdrawalsCount: Math.max(20, prev.predictedWithdrawalsCount + result.kpiDelta.predictedWithdrawalsDelta)
      }));
      addAuditEntry('SCENARIO_APPLIED', scenarioId, result.summary);
      setIsRefreshingRisk(false);
    }, 300);
  };

  // Handler: Live Refresh Risk Intelligence
  const handleRefreshIntelligence = () => {
    setIsRefreshingRisk(true);
    setTimeout(() => {
      const scenarios: IntelligenceScenarioId[] = ['BASELINE_FLAGSHIP', 'ESCALATED_BURST', 'INTERCEPTION_SUPPRESSED'];
      const nextIdx = (scenarios.indexOf(activeScenarioId) + 1) % scenarios.length;
      const nextScenarioId = scenarios[nextIdx];
      setActiveScenarioId(nextScenarioId);
      const scenario = INTELLIGENCE_SCENARIOS[nextScenarioId];
      const result = scenario.apply(locations);
      setLocations(result.updatedLocations);
      setSelectedLocation(result.updatedLocations[0]);
      setStats(prev => ({
        ...prev,
        totalComplaints: prev.totalComplaints + result.kpiDelta.complaintsDelta,
        activeAlerts: Math.max(1, prev.activeAlerts + result.kpiDelta.alertsDelta),
        highRiskLocationsCount: Math.max(1, prev.highRiskLocationsCount + result.kpiDelta.highRiskDelta)
      }));
      addAuditEntry('INTELLIGENCE_REFRESH', nextScenarioId, `Deterministic risk scores refreshed: ${result.summary}`);
      setIsRefreshingRisk(false);
    }, 350);
  };

  // Handler: Select SIH Demo Step
  const handleSelectStep = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
    const step = SIH_DEMO_STEPS[stepIndex];
    if (step) {
      setActiveTab(step.tab);
      if (step.step === 5 || step.subtitle.includes('Nagapattinam')) {
        const ngp = locations.find(l => l.atmCode === 'ATM-NGP-04' || l.id === 'atm-001');
        if (ngp) setSelectedLocation(ngp);
      }
    }
  };

  // Handler: Reset Full Demo
  const handleResetFullDemo = () => {
    setLocations(TAMIL_NADU_ATMS);
    setSelectedLocation(TAMIL_NADU_ATMS[0]);
    setAlerts(INITIAL_ALERTS);
    setSensors(INITIAL_CAMERA_SENSORS);
    setTimeline(INITIAL_TIMELINE);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentStepIndex(0);
    setActiveScenarioId('BASELINE_FLAGSHIP');
    setActiveTab('COMMAND_CENTER');
  };

  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex overflow-hidden font-body selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Left Navigation Sidebar matching screenshot */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => handleOpenReport(undefined, selectedLocation || locations[0])}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#070b14]">
        {/* Top Header Bar */}
        <TopHeader
          currentUser={currentUser}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onSwitchUser={setCurrentUser}
          availableUsers={AVAILABLE_USERS}
        />

        {/* SIH Judge-Ready Automated 11-Step Interactive Demo Controller Banner */}
        <div className="w-full px-4 sm:px-6 pt-3 shrink-0">
          <SihDemoController
            currentStepIndex={currentStepIndex}
            onSelectStep={handleSelectStep}
            onResetDemo={handleResetFullDemo}
            onOpenReportModal={() => handleOpenReport(undefined, selectedLocation || locations[0])}
            activeScenarioId={activeScenarioId}
            onSelectScenario={handleSelectScenario}
            onRefreshIntelligence={handleRefreshIntelligence}
            isRefreshing={isRefreshingRisk}
          />
        </div>

        {/* Main Tab Content Canvas */}
        <main className="flex-1 w-full p-4 sm:p-6">
          {/* Tab 1: COMMAND CENTER */}
          {activeTab === 'COMMAND_CENTER' && (
            <CommandCenter
              stats={stats}
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              onNavigateToPredict={() => setActiveTab('PREDICTION_ENGINE')}
              onNavigateToAlerts={() => setActiveTab('ALERTS')}
              onNavigateToGis={() => setActiveTab('GIS_MAP')}
              onOpenReport={handleOpenReport}
              onRefreshIntelligence={handleRefreshIntelligence}
              isRefreshing={isRefreshingRisk}
            />
          )}

          {/* Tab 2: CASE INPUT & PREDICTION ENGINE */}
          {activeTab === 'PREDICTION_ENGINE' && (
            <div className="space-y-6">
              <CaseInputPredictor
                onAnalyze={handleAnalyzeComplaint}
                predictedLocations={locations}
                onSelectLocation={setSelectedLocation}
                selectedLocation={selectedLocation}
                currentUser={currentUser}
                isAnalyzing={isAnalyzing}
                demoRiskScore={demoRiskScore}
                confidenceScore={confidenceScore}
                predictionWindow={predictionWindow}
              />

              {selectedLocation && (
                <ExplainableAiPanel
                  location={selectedLocation}
                  aiAnalysisText={aiAnalysisSummary}
                  onGenerateAlert={(loc) => {
                    handleOpenReport(undefined, loc);
                  }}
                />
              )}
            </div>
          )}

          {/* Tab 3: GIS RISK MAP DASHBOARD (matches requested screenshot & serial alignment) */}
          {activeTab === 'GIS_MAP' && (
            <GisMapDashboard
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              onInvestigateLocation={(loc) => handleOpenReport(undefined, loc)}
              onRefreshIntelligence={handleRefreshIntelligence}
              isRefreshing={isRefreshingRisk}
            />
          )}

        {/* Tab 4: CAMERA SENSOR MODULE */}
        {activeTab === 'SENSORS' && (
          <CameraSensorModule
            sensors={sensors}
            onScanCameras={handleScanCameras}
            isScanning={isScanningSensors}
            onSelectSensorLocation={handleFocusLocationOnMap}
          />
        )}

        {/* Tab 5: HUMAN-IN-THE-LOOP VERIFICATION */}
        {activeTab === 'VERIFICATION' && (
          <HumanVerificationPanel
            location={selectedLocation || locations[0]}
            sensor={sensors.find(s => s.locationId === (selectedLocation?.atmCode || 'ATM-NGP-001'))}
            currentUser={currentUser}
            complaintDetails={{
              type: 'Investment Task Scam / Telegram Fraud',
              amount: 350000,
              accountRef: 'AXIS-CYB-88192-TN',
              expectedWindow: selectedLocation?.predictedWindow || '20:00 – 22:00 IST',
              relatedCount: 7,
              region: selectedLocation?.region || 'Nagapattinam'
            }}
            verificationRecord={verificationRecord}
            onDecision={handleVerificationDecision}
            onNavigateToAlerts={() => setActiveTab('ALERTS')}
            onNavigateToGis={() => setActiveTab('GIS_MAP')}
            onNavigateToSensors={() => setActiveTab('SENSORS')}
          />
        )}

        {/* Tab 6: ALERT ENGINE */}
        {activeTab === 'ALERTS' && (
          <AlertEngine
            alerts={alerts}
            onAlertAction={handleAlertAction}
            onGenerateReportForAlert={handleOpenReport}
            onFocusLocation={handleFocusLocationOnMap}
            onNavigateToVerification={() => setActiveTab('VERIFICATION')}
            currentUser={currentUser}
          />
        )}

        {/* Tab 7: INVESTIGATION TIMELINE */}
        {activeTab === 'TIMELINE' && (
          <InvestigationTimeline
            timeline={timeline}
            onAdvanceStep={handleAdvanceTimelineStep}
          />
        )}

        {/* Tab 8: WHAT-IF SIMULATION */}
        {activeTab === 'SIMULATION' && (
          <WhatIfSimulation
            locations={locations}
            onApplySimulation={handleApplySimulation}
            onSelectLocation={setSelectedLocation}
          />
        )}

        {/* Tab 9: ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
          <AnalyticsView />
        )}

        {/* Tab 10: SECURITY & AUDIT */}
        {activeTab === 'SECURITY' && (
          <SecurityAuditModal
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            auditLogs={auditLogs}
            onToggleTamperSimulation={handleToggleTamperSimulation}
            onRestoreChain={handleRestoreChain}
          />
        )}
      </main>

      {/* Official Printable Interception Advisory Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedLocation={selectedLocation}
        alert={reportAlert}
        currentUser={currentUser}
        verificationRecord={verificationRecord}
      />

        {/* Footer Banner */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-6 text-center text-[11px] font-mono-code text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>SMART INDIA HACKATHON PROTOTYPE • PREDICTIVE CYBERCRIME INTELLIGENCE SYSTEM</span>
            <span className="text-cyan-400">STATE CYBER CRIME CELL • CITIZEN LOSS PREVENTION</span>
            <span className="text-amber-400/80">SYNTHETIC EVALUATION MODE (NO BIOMETRIC IDENTIFICATION)</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
