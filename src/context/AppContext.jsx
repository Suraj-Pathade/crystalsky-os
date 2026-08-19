import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { StorageService } from '../services/storageService';
import { AuthService } from '../services/authService';
import { 
  SAMPLE_CLIENTS, SAMPLE_EVENTS, SAMPLE_PAYMENTS, 
  SAMPLE_EXPENSES, SAMPLE_TEAM, SAMPLE_EVENT_TEAM, 
  SAMPLE_TASKS, SAMPLE_DELIVERABLES 
} from '../data/sampleData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Security Auth Session State
  const [authSession, setAuthSession] = useState(() => AuthService.getCurrentSession());

  const loginWithPassword = (identifier, password) => {
    const result = AuthService.login(identifier, password);
    if (result.success) {
      setAuthSession(result.session);
      showToast('🔒 Welcome Pravin Ghukshe! System unlocked successfully.');
    }
    return result;
  };

  const lockApp = () => {
    AuthService.logout();
    setAuthSession({ isLoggedIn: false, user: null });
    showToast('🔒 System locked.');
  };

  const isAuthenticated = authSession.isLoggedIn;
  const currentUser = authSession.user;

  // Light / Dark Mode state
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('crystalsky_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('crystalsky_theme', themeMode);
    if (themeMode === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // App Data State
  const [settings, setSettings] = useState(StorageService.getSettings());
  const [clients, setClients] = useState(StorageService.getClients());
  const [events, setEvents] = useState(StorageService.getEvents());
  const [payments, setPayments] = useState(StorageService.getPayments());
  const [expenses, setExpenses] = useState(StorageService.getExpenses());
  const [team, setTeam] = useState(StorageService.getTeam());
  const [eventTeam, setEventTeam] = useState(StorageService.getEventTeamAssignments());
  const [tasks, setTasks] = useState(StorageService.getTasks());
  const [deliverables, setDeliverables] = useState(StorageService.getDeliverables());
  const [auditLogs, setAuditLogs] = useState(StorageService.getAuditLogs());

  // Show Toast Alert helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Refresh all state from local storage engine
  const refreshData = () => {
    setSettings(StorageService.getSettings());
    setClients(StorageService.getClients());
    setEvents(StorageService.getEvents());
    setPayments(StorageService.getPayments());
    setExpenses(StorageService.getExpenses());
    setTeam(StorageService.getTeam());
    setEventTeam(StorageService.getEventTeamAssignments());
    setTasks(StorageService.getTasks());
    setDeliverables(StorageService.getDeliverables());
    setAuditLogs(StorageService.getAuditLogs());
  };

  // On App Mount: Fetch live data from Google Sheets if connected
  useEffect(() => {
    const fetchLiveSheetsData = async () => {
      if (settings.googleScriptUrl) {
        const liveData = await StorageService.fetchLiveDataFromSheets();
        if (liveData) {
          refreshData();
          showToast('Synced live data from Google Sheets at runtime!');
        }
      }
    };
    fetchLiveSheetsData();
  }, []);

  // 1-Click Clear Database
  const clearDatabase = () => {
    StorageService.clearAllData();
    refreshData();
    showToast('Cleared database to empty state.');
  };

  // Actions
  const updateSettings = (newSettings) => {
    const updated = StorageService.saveSettings(newSettings);
    setSettings(updated);
    showToast('Settings saved successfully!');
  };

  const saveClient = (clientData) => {
    const saved = StorageService.saveClient(clientData);
    refreshData();
    showToast(`Client "${saved.Name}" saved to Google Sheets in real-time!`);
    return saved;
  };

  const deleteClient = (id) => {
    StorageService.deleteClient(id);
    refreshData();
    showToast('Client archived');
  };

  const saveEvent = (eventData) => {
    const saved = StorageService.saveEvent(eventData);
    refreshData();
    showToast(`Shoot "${saved.EventName}" saved to Google Sheets in real-time!`);
    return saved;
  };

  const deleteEvent = (id) => {
    StorageService.deleteEvent(id);
    refreshData();
    showToast('Event archived');
  };

  const savePayment = (paymentData) => {
    const saved = StorageService.savePayment(paymentData);
    refreshData();
    showToast(`Payment of ₹${Number(saved.Amount).toLocaleString('en-IN')} saved to Google Sheets in real-time!`);
    return saved;
  };

  const saveExpense = (expenseData) => {
    const saved = StorageService.saveExpense(expenseData);
    refreshData();
    showToast(`Expense of ₹${Number(saved.Amount).toLocaleString('en-IN')} saved to Google Sheets in real-time!`);
    return saved;
  };

  const deleteExpense = (id) => {
    StorageService.deleteExpense(id);
    refreshData();
    showToast('Expense deleted');
  };

  const saveTeamMember = (memberData) => {
    const saved = StorageService.saveTeamMember(memberData);
    refreshData();
    showToast(`Team member "${saved.Name}" saved to Google Sheets in real-time!`);
    return saved;
  };

  const saveEventTeamAssignment = (assignmentData) => {
    const saved = StorageService.saveEventTeamAssignment(assignmentData);
    refreshData();
    showToast(`Assigned ${saved.PersonName} to shoot!`);
    return saved;
  };

  const saveTask = (taskData) => {
    const saved = StorageService.saveTask(taskData);
    refreshData();
    showToast(`Task "${saved.TaskName}" saved to Google Sheets in real-time!`);
    return saved;
  };

  const saveDeliverable = (delivData) => {
    const saved = StorageService.saveDeliverable(delivData);
    refreshData();
    showToast(`Deliverable "${saved.Type}" saved to Google Sheets in real-time!`);
    return saved;
  };

  // Calculations for Financial Summary
  const financials = useMemo(() => {
    const totalContractValue = events.reduce((sum, e) => sum + Number(e.TotalContractValue || 0), 0);
    const totalReceived = payments.reduce((sum, p) => sum + Number(p.Amount || 0), 0);
    const totalReceivable = Math.max(0, totalContractValue - totalReceived);

    const totalExpenses = expenses.reduce((sum, ex) => sum + Number(ex.Amount || 0), 0);
    const totalTeamCost = eventTeam.reduce((sum, et) => sum + Number(et.AgreedAmount || 0), 0);
    const totalTeamPaid = eventTeam.reduce((sum, et) => sum + Number(et.PaidAmount || 0), 0);
    const teamPayables = Math.max(0, totalTeamCost - totalTeamPaid);

    const totalCosts = totalExpenses;
    const estimatedContractProfit = totalContractValue - totalCosts;
    const contractProfitMargin = totalContractValue > 0 ? ((estimatedContractProfit / totalContractValue) * 100).toFixed(1) : 0;

    const cashProfit = totalReceived - totalExpenses;

    return {
      totalContractValue,
      totalReceived,
      totalReceivable,
      totalExpenses,
      totalTeamCost,
      totalTeamPaid,
      teamPayables,
      estimatedContractProfit,
      contractProfitMargin,
      cashProfit
    };
  }, [events, payments, expenses, eventTeam]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedEventId,
        setSelectedEventId,
        selectedClientId,
        setSelectedClientId,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        themeMode,
        toggleThemeMode,
        isAuthenticated,
        currentUser,
        loginWithPassword,
        lockApp,
        settings,
        updateSettings,
        clients,
        saveClient,
        deleteClient,
        events,
        saveEvent,
        deleteEvent,
        payments,
        savePayment,
        expenses,
        saveExpense,
        deleteExpense,
        team,
        saveTeamMember,
        eventTeam,
        saveEventTeamAssignment,
        tasks,
        saveTask,
        deliverables,
        saveDeliverable,
        auditLogs,
        refreshData,
        clearDatabase,
        financials
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
