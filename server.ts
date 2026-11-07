import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { TAMIL_NADU_ATMS, INITIAL_CAMERA_SENSORS } from './src/data/mockData';
import { AlertItem } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch {
    // Non-fatal, fallback reasoning generator is active
  }
}

// In-memory data store for the session
let alertDatabase: AlertItem[] = [
  {
    id: 'ALT-2026-0901',
    alertCode: 'ALERT-HIGH-001',
    atmId: 'ATM-NGP-001',
    atmName: 'Nagapattinam Port Coastal ATM Kiosk',
    region: 'Nagapattinam Coastal',
    riskScore: 92,
    expectedWindow: '20:00 – 22:00',
    priority: 'CRITICAL',
    status: 'ACTIVE',
    timestamp: '19:42:15 IST',
    caseRef: 'CYB-TN-2026-8891',
    amount: 350000,
    assignedOfficer: 'Insp. V. Raghavan'
  },
  {
    id: 'ALT-2026-0902',
    alertCode: 'ALERT-HIGH-002',
    atmId: 'ATM-CHN-042',
    atmName: 'Central Station Western Concourse Kiosk',
    region: 'Chennai Central',
    riskScore: 89,
    expectedWindow: '21:00 – 23:00',
    priority: 'CRITICAL',
    status: 'INVESTIGATING',
    timestamp: '19:15:40 IST',
    caseRef: 'CYB-TN-2026-8843',
    amount: 520000,
    assignedOfficer: 'Sub-Insp. Priya Selvam'
  },
  {
    id: 'ALT-2026-0903',
    alertCode: 'ALERT-MED-003',
    atmId: 'ATM-CHN-014',
    atmName: 'T. Nagar South Boag Road Terminal',
    region: 'Chennai Central',
    riskScore: 86,
    expectedWindow: '18:30 – 21:00',
    priority: 'HIGH',
    status: 'ACKNOWLEDGED',
    timestamp: '18:10:02 IST',
    caseRef: 'CYB-TN-2026-8799',
    amount: 180000,
    assignedOfficer: 'Head Const. K. Murugan',
    acknowledgedAt: '18:22:10 IST'
  },
  {
    id: 'ALT-2026-0904',
    alertCode: 'ALERT-MED-004',
    atmId: 'ATM-CBE-007',
    atmName: 'Gandhipuram Cross Cut Road Hub',
    region: 'Coimbatore West',
    riskScore: 81,
    expectedWindow: '19:00 – 21:30',
    priority: 'HIGH',
    status: 'DISPATCHED',
    timestamp: '17:50:33 IST',
    caseRef: 'CYB-TN-2026-8711',
    amount: 245000,
    assignedOfficer: 'Flying Squad QRT-02'
  }
];

let auditLogs = [
  {
    id: 'log-101',
    timestamp: '2026-09-09 18:35:10 IST',
    officerName: 'Insp. V. Raghavan',
    badgeNumber: 'TN-CYB-4091',
    action: 'DISPATCH_ALERT',
    resource: 'ALERT-HIGH-001',
    details: 'Dispatched emergency interception advisory for ATM-NGP-001 to Coastal QRT-04 unit.',
    ipAddress: '10.244.18.42 (Internal Police VPN)'
  },
  {
    id: 'log-102',
    timestamp: '2026-09-09 18:24:05 IST',
    officerName: 'Insp. V. Raghavan',
    badgeNumber: 'TN-CYB-4091',
    action: 'SCAN_CAMERA_SENSORS',
    resource: 'CAM-ATM-01',
    details: 'Initiated authorized anomaly motion scan for Nagapattinam ATM cluster.',
    ipAddress: '10.244.18.42 (Internal Police VPN)'
  },
  {
    id: 'log-103',
    timestamp: '2026-09-09 18:15:00 IST',
    officerName: 'Sub-Insp. Priya Selvam',
    badgeNumber: 'TN-CYB-5820',
    action: 'RUN_PREDICTION',
    resource: 'CASE-CYB-TN-8891',
    details: 'Executed AI predictive analytics algorithm on ₹3,50,000 investment fraud complaint.',
    ipAddress: '10.244.20.15 (Coimbatore CP Office)'
  }
];

/**
 * Resilient AI Intelligence Generator:
 * Tries modern Gemini models in sequence (gemini-3.8-flash -> gemini-flash-latest -> gemini-3.1-flash-lite)
 * with backoff on 503/429 spikes, and seamlessly falls back to domain-specific analytical synthesis.
 */
async function generateAiIntelligence(
  prompt: string,
  complaintType: string,
  amount: number,
  region: string,
  withdrawalWindow: string
): Promise<string> {
  if (ai) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

    for (const model of candidateModels) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT')), 4000)
        );
        const apiPromise = ai.models.generateContent({
          model,
          contents: prompt,
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        if (response?.text && response.text.trim().length > 0) {
          return response.text.trim();
        }
      } catch {
        // Continue to next candidate model seamlessly
        continue;
      }
    }
  }

  // Graceful domain advisory generation if models are busy or temporarily unavailable
  return generateDomainAdvisory(complaintType, amount, region, withdrawalWindow);
}

function generateDomainAdvisory(
  complaintType: string,
  amount: number,
  region: string,
  withdrawalWindow: string
): string {
  const formattedAmt = `₹${amount.toLocaleString('en-IN')}`;
  return `Operational Intelligence Assessment: Syndicates operating ${complaintType} schemes in ${region} routinely route funds through fast-layering mule bank networks before initiating physical cash-outs. Given the high-velocity transfer of ${formattedAmt}, cash withdrawal at perimeter ATMs is imminent within the ${withdrawalWindow} window to evade banking fraud alerts. Field units are advised to maintain discreet surveillance at high-traffic ATM kiosks and preserve CCTV footage.`;
}

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Predictive Cybercrime Intelligence System (SIH Prototype)',
    environment: 'Demo / Synthetic Testing Mode',
    timestamp: new Date().toISOString(),
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Overall stats
app.get('/api/stats', (req, res) => {
  const activeAlerts = alertDatabase.filter(a => a.status === 'ACTIVE').length;
  const statsPayload = {
    totalComplaints: 14892,
    activeAlerts: activeAlerts,
    highRiskLocationsCount: 12,
    predictedWithdrawalsCount: 47,
    avgConfidence: 88,
    preventedLossTotal: '₹4.28 Cr'
  };

  res.json({
    stats: statsPayload,
    ...statsPayload,
    resolvedInterceptions: 128,
    preventedLossAmountInr: 42850000
  });
});

// Predictions endpoint
app.post('/api/predict', async (req, res) => {
  const complaint = req.body.complaint || req.body || {};
  const officer = req.body.officer || {};

  const complaintType = complaint.complaintType || 'Part-Time Job / Task Investment Scam';
  const amount = Number(complaint.amount) || 350000;
  const expectedWithdrawalTime = complaint.expectedWithdrawalTime || '20:00 – 22:00';
  const previousComplaintsCount = Number(complaint.previousComplaintsCount) || 5;
  const accountRef = complaint.accountRef || 'TXN-UNKNOWN';
  const region = complaint.region || 'Nagapattinam Coastal';

  // Multi-variable scoring heuristic
  const amountFactor = Math.min(96, Math.max(40, Math.round(45 + (amount / 10000) * 1.1)));
  const historyFactor = Math.min(98, Math.max(35, Math.round(42 + previousComplaintsCount * 7)));
  const baseRisk = Math.min(97, Math.max(30, Math.round((amountFactor * 0.45) + (historyFactor * 0.55))));

  // Dynamically rank candidate ATM locations based on district and transaction amount
  const updatedLocations = TAMIL_NADU_ATMS.map((atm, idx) => {
    const isTargetRegion = 
      atm.region.toLowerCase().includes(region.toLowerCase()) || 
      region.toLowerCase().includes(atm.city.toLowerCase()) ||
      (region.toLowerCase().includes('nagapattinam') && atm.city.toLowerCase().includes('nagapattinam'));

    const calculatedScore = isTargetRegion
      ? Math.min(98, Math.max(76, baseRisk - idx * 2))
      : Math.max(25, atm.riskScore - 18);

    const level = calculatedScore >= 75 ? 'HIGH' : calculatedScore >= 45 ? 'MEDIUM' : 'LOW';

    return {
      ...atm,
      riskScore: calculatedScore,
      riskLevel: level as 'HIGH' | 'MEDIUM' | 'LOW',
      confidence: Math.min(95, Math.max(68, Math.round(calculatedScore * 0.94))),
      predictedWindow: expectedWithdrawalTime
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  const prompt = `You are a Senior Cybercrime Intelligence Specialist reviewing a high-priority cybercrime complaint for a law enforcement dashboard (Smart India Hackathon prototype).
Case parameters:
- Crime Type: ${complaintType}
- Fraud Amount: INR ${amount.toLocaleString('en-IN')}
- Target Region: ${region}
- Number of Previous Related Cases: ${previousComplaintsCount}
- Transaction Ref: ${accountRef}
- Expected Withdrawal Window: ${expectedWithdrawalTime}

Provide a 2-3 sentence operational intelligence explanation summarizing why physical cash withdrawal at local ATMs is imminent, how syndicates deploy cash-out mules, and what proactive tactical interception instructions are advised. Do not mention facial recognition. Keep it crisp, technical, and professional.`;

  const aiReasoning = await generateAiIntelligence(
    prompt,
    complaintType,
    amount,
    region,
    expectedWithdrawalTime
  );

  // Audit log entry
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    officerName: officer.name || req.body.officerName || 'Lead Cyber Investigator',
    badgeNumber: officer.badgeNumber || req.body.badgeNumber || 'TN-CYB-4091',
    action: 'PREDICTION_EXECUTION',
    resource: accountRef,
    details: `Generated predictive cash-out location forecast for ₹${amount.toLocaleString('en-IN')} in ${region}. Primary candidate: ${updatedLocations[0].name} (${updatedLocations[0].riskScore}%).`,
    ipAddress: '10.244.18.42 (Internal VPN)'
  });

  res.json({
    success: true,
    predictedLocations: updatedLocations,
    overallRiskScore: baseRisk,
    demoRiskScore: baseRisk,
    confidenceScore: Math.min(94, Math.max(70, Math.round(baseRisk * 0.92))),
    predictionWindow: expectedWithdrawalTime,
    predictionTimeWindow: expectedWithdrawalTime,
    aiAnalysis: aiReasoning,
    timestamp: new Date().toISOString()
  });
});

// Camera sensors list & scanning endpoint
app.post('/api/cameras/scan', (req, res) => {
  const officer = req.body.officer || {};
  const scannedSensors = INITIAL_CAMERA_SENSORS.map(s => ({
    ...s,
    status: 'ONLINE' as const,
    lastScanTime: 'Just now (live)'
  }));

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    officerName: officer.name || req.body.officerName || 'Lead Cyber Investigator',
    badgeNumber: officer.badgeNumber || req.body.badgeNumber || 'TN-CYB-4091',
    action: 'CAMERA_SENSOR_SCAN',
    resource: 'AUTHORIZED_CCTV_CLUSTER',
    details: 'Scanned authorized camera sensors across high-risk ATM nodes for motion/loitering anomalies.',
    ipAddress: '10.244.18.42 (Internal VPN)'
  });

  res.json({
    success: true,
    sensors: scannedSensors,
    scannedCount: scannedSensors.length,
    anomalyCount: 4,
    timestamp: new Date().toISOString(),
    notice: 'Camera alerts are supporting signals for investigator verification and are not evidence of criminal activity.'
  });
});

// Alerts endpoints
app.get('/api/alerts', (req, res) => {
  res.json({ alerts: alertDatabase });
});

app.post('/api/alerts', (req, res) => {
  const { alertId, action, officer, notes } = req.body;
  const alertIndex = alertDatabase.findIndex(a => a.id === alertId);

  if (alertIndex !== -1) {
    if (action === 'ACKNOWLEDGE') {
      alertDatabase[alertIndex].status = 'ACKNOWLEDGED';
      alertDatabase[alertIndex].acknowledgedAt = new Date().toLocaleTimeString() + ' IST';
    } else if (action === 'INVESTIGATE') {
      alertDatabase[alertIndex].status = 'INVESTIGATING';
    } else if (action === 'DISPATCH') {
      alertDatabase[alertIndex].status = 'DISPATCHED';
    } else if (action === 'RESOLVE') {
      alertDatabase[alertIndex].status = 'RESOLVED';
    }

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      officerName: officer?.name || 'Duty Officer',
      badgeNumber: officer?.badgeNumber || 'TN-CYB-POLICE',
      action: `ALERT_${action}`,
      resource: alertId,
      details: notes || `Alert ${alertId} updated to status ${alertDatabase[alertIndex].status}`,
      ipAddress: '10.244.18.42'
    });

    return res.json({ success: true, alert: alertDatabase[alertIndex] });
  }

  res.status(404).json({ error: 'Alert not found' });
});

app.post('/api/alerts/:id/action', (req, res) => {
  const { id } = req.params;
  const { action, officerName, notes } = req.body;
  const alertIndex = alertDatabase.findIndex(a => a.id === id);

  if (alertIndex !== -1) {
    if (action === 'ACKNOWLEDGE') {
      alertDatabase[alertIndex].status = 'ACKNOWLEDGED';
      alertDatabase[alertIndex].acknowledgedAt = new Date().toLocaleTimeString() + ' IST';
    } else if (action === 'INVESTIGATE') {
      alertDatabase[alertIndex].status = 'INVESTIGATING';
    } else if (action === 'DISPATCH') {
      alertDatabase[alertIndex].status = 'DISPATCHED';
    } else if (action === 'RESOLVE') {
      alertDatabase[alertIndex].status = 'RESOLVED';
    }

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      officerName: officerName || 'Duty Officer',
      badgeNumber: 'TN-CYB-POLICE',
      action: `ALERT_${action}`,
      resource: id,
      details: notes || `Alert ${id} updated to status ${alertDatabase[alertIndex].status}`,
      ipAddress: '10.244.18.42'
    });

    return res.json({ success: true, alert: alertDatabase[alertIndex] });
  }

  res.status(404).json({ error: 'Alert not found' });
});

// Audit log endpoint
app.get('/api/audit-log', (req, res) => {
  res.json({ logs: auditLogs.slice(0, 50) });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Predictive Cybercrime Intelligence Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
