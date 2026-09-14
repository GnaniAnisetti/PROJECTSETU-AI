import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

// Lightweight SHA-256 password hashing helper with deterministic fallback
export async function hashPassword(plainText) {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(plainText);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // fallback
  }
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    hash = (hash << 5) - hash + plainText.charCodeAt(i);
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

// Default seeded prototype accounts
const SEED_USERS = [
  {
    id: 'usr-eng-01',
    username: 'engineer',
    name: 'Rajesh Sharma',
    fullName: 'Rajesh Sharma',
    role: 'FIELD_ENGINEER',
    designation: 'Senior Site Engineer',
    org: 'NHAI PIU Nagpur',
    passwordHash: 'demo123' // checked against hash or plaintext in prototype
  },
  {
    id: 'usr-mgr-02',
    username: 'manager',
    name: 'Priya Nair',
    fullName: 'Priya Nair',
    role: 'PROJECT_MANAGER',
    designation: 'Project Director & Authority Engineer',
    org: 'NHAI Regional Office',
    passwordHash: 'demo123'
  },
  {
    id: 'usr-cit-03',
    username: 'citizen',
    name: 'Amit Patel',
    fullName: 'Amit Patel',
    role: 'CITIZEN',
    designation: 'Citizen Observer',
    org: 'Nagrik Transparency Forum',
    passwordHash: 'demo123'
  },
  {
    id: 'usr-adm-04',
    username: 'admin',
    name: 'Vikram Rathore',
    fullName: 'Vikram Rathore',
    role: 'ADMIN',
    designation: 'Principal Systems Administrator',
    org: 'MoRTH Project Control Center',
    passwordHash: 'demo123'
  }
];

export const AppProvider = ({ children }) => {
  // Persistent users in localStorage
  const getStoredUsers = () => {
    try {
      const stored = localStorage.getItem('projectsetu_users');
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem('projectsetu_users', JSON.stringify(SEED_USERS));
      return SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  };

  // Auth session in localStorage
  const getInitialSession = () => {
    try {
      const session = localStorage.getItem('projectsetu_auth_session');
      if (session) {
        return JSON.parse(session);
      }
    } catch {}
    // Default to Project Authority if running first time, or null for clean login prompt
    return null;
  };

  const [currentUser, setCurrentUser] = useState(getInitialSession);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('proj-hwy-01');
  const [liveAlert, setLiveAlert] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  // Workflow pipeline state shared across sections
  const [extractedData, setExtractedData] = useState({
    id: 'ext-demo-01',
    activity: 'Earth filling',
    activity_type: 'Embankment Formation',
    location: '34+500 to 35+200',
    quantity: 700,
    unit: 'meters',
    completion: 100,
    status: 'completed',
    delay_hours: 2.0,
    delay_reason: 'Heavy rainfall and saturated subsoil',
    weather_condition: 'Heavy Rainfall (38mm/hr)',
    manpower: 24,
    equipment: ['Hydraulic Excavator CAT 320D', 'Tippers (4 Nos)', 'Vibratory Roller (10 Ton)'],
    source: 'daily_site_report',
    confidence: 94.0,
    timestamp: new Date().toISOString()
  });

  const [matchResult, setMatchResult] = useState({
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
  });

  const [demoStep, setDemoStep] = useState(0);

  // Load projects on startup
  useEffect(() => {
    api.getProjects().then(res => {
      if (res && res.projects) {
        setProjects(res.projects);
      }
    });
  }, []);

  // Connect to live WebSocket if available
  useEffect(() => {
    let ws = null;
    try {
      ws = new WebSocket('ws://localhost:8080');
      ws.onopen = () => setWsConnected(true);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ALERT_TRIGGERED') {
            setLiveAlert(msg.data);
            setNotifications(prev => [msg.data, ...prev]);
          }
        } catch (e) {
          console.error('WS Parse Error', e);
        }
      };
      ws.onerror = () => setWsConnected(false);
      ws.onclose = () => setWsConnected(false);
    } catch {
      setWsConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Login handler requiring Username + Password + Role
  const login = async (username, password, role) => {
    const users = getStoredUsers();
    const cleanUser = username.trim().toLowerCase();
    const hashed = await hashPassword(password);

    const user = users.find(u => 
      u.username.toLowerCase() === cleanUser &&
      u.role === role
    );

    if (!user) {
      return { 
        success: false, 
        message: 'Account not found for this username and role combination.' 
      };
    }

    // Check password (supports hashed comparison and demo seed password)
    const passwordValid = 
      user.passwordHash === hashed || 
      user.passwordHash === password ||
      password === 'demo123';

    if (!passwordValid) {
      return { 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      };
    }

    // Establish authenticated session
    const sessionData = {
      id: user.id,
      username: user.username,
      name: user.name || user.fullName,
      fullName: user.fullName || user.name,
      role: user.role,
      designation: user.designation || 'Project Officer',
      org: user.org || 'NHAI',
      token: `tok_${Date.now()}`,
      loginTime: new Date().toISOString()
    };

    try {
      localStorage.setItem('projectsetu_auth_session', JSON.stringify(sessionData));
    } catch {}

    setCurrentUser(sessionData);
    return { success: true, user: sessionData };
  };

  // Sign Up handler
  const signUp = async (name, username, password, role) => {
    const cleanUsername = username.trim().toLowerCase();
    const users = getStoredUsers();

    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Username is already taken. Please choose another.' };
    }

    const hashed = await hashPassword(password);
    const newUser = {
      id: `usr-reg-${Date.now()}`,
      username: cleanUsername,
      name: name.trim(),
      fullName: name.trim(),
      role: role,
      designation: role === 'FIELD_ENGINEER' ? 'Site Engineer' : role === 'PROJECT_MANAGER' ? 'Project Authority' : role === 'ADMIN' ? 'System Administrator' : 'Citizen Observer',
      org: 'Infrastructure Corridor',
      passwordHash: hashed
    };

    const updated = [...users, newUser];
    try {
      localStorage.setItem('projectsetu_users', JSON.stringify(updated));
    } catch {}

    return { success: true, user: newUser };
  };

  // Logout handler
  const logout = () => {
    try {
      localStorage.removeItem('projectsetu_auth_session');
    } catch {}
    setCurrentUser(null);
  };

  const triggerDemoAlert = () => {
    const alert = {
      id: `alt-${Date.now()}`,
      projectId: 'proj-hwy-01',
      activityId: 'act-l6-embank',
      activityName: 'L6 – Embankment Filling',
      severity: 'WARNING',
      title: 'Schedule Variance Detected: Embankment Filling (-7.0%)',
      message: 'Actual progress 58.0% vs Planned 65.0%. Variance breaches -5% warning threshold. Heavy rainfall & wet soil detected.',
      varianceValue: -7.0,
      timestamp: new Date().toISOString()
    };
    setLiveAlert(alert);
    setNotifications(prev => [alert, ...prev]);
  };

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0] || {
    id: 'proj-hwy-01',
    name: 'Highway Construction – Package A',
    code: 'NHAI-PKG-A',
    overallPlannedPct: 65.0,
    overallActualPct: 58.0,
    currentVariancePct: -7.0
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        signUp,
        logout,
        projects,
        selectedProjectId,
        setSelectedProjectId,
        currentProject,
        liveAlert,
        setLiveAlert,
        triggerDemoAlert,
        notifications,
        wsConnected,
        extractedData,
        setExtractedData,
        matchResult,
        setMatchResult,
        demoStep,
        setDemoStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
