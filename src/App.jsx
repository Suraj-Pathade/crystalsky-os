import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import SecurityGateScreen from './components/SecurityGateScreen';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Header from './components/Header';
import QuickAddModal from './components/QuickAddModal';
import SetupWizard from './components/SetupWizard';

// Views
import DashboardView from './views/DashboardView';
import EventsView from './views/EventsView';
import EventDetailView from './views/EventDetailView';
import EventModal from './views/EventModal';

import ClientsView from './views/ClientsView';
import ClientDetailView from './views/ClientDetailView';
import ClientModal from './views/ClientModal';

import PaymentsView from './views/PaymentsView';
import PaymentModal from './views/PaymentModal';
import PaymentReceiptModal from './views/PaymentReceiptModal';

import ExpensesView from './views/ExpensesView';
import ExpenseModal from './views/ExpenseModal';

import TeamView from './views/TeamView';
import PayablesView from './views/PayablesView';
import TeamMemberModal from './views/TeamMemberModal';

import TasksView from './views/TasksView';
import DeliverablesView from './views/DeliverablesView';
import CalendarView from './views/CalendarView';
import ReceivablesView from './views/ReceivablesView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import IntegrationsTestPage from './views/IntegrationsTestPage';
import AuditLogView from './views/AuditLogView';

function MainAppContent() {
  const { activeView, setActiveView, toastMessage, isAuthenticated, loginWithPassword } = useApp();

  // Modals state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activePaymentForReceipt, setActivePaymentForReceipt] = useState(null);

  // Strict Password Gate Lockout: If not logged in, block everything!
  if (!isAuthenticated) {
    return <SecurityGateScreen onLoginSuccess={loginWithPassword} />;
  }

  const handleQuickAddAction = (actionId) => {
    if (actionId === 'new_client') setClientModalOpen(true);
    else if (actionId === 'new_event') setEventModalOpen(true);
    else if (actionId === 'record_payment') setPaymentModalOpen(true);
    else if (actionId === 'add_expense') setExpenseModalOpen(true);
    else if (actionId === 'add_task') setActiveView('tasks');
  };

  const handleShowReceipt = (payment) => {
    setActivePaymentForReceipt(payment);
    setReceiptModalOpen(true);
  };

  if (activeView === 'setup') {
    return <SetupWizard onComplete={() => setActiveView('dashboard')} />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 mobile-padding-bottom">
        <Header onOpenQuickAdd={() => setQuickAddOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && <DashboardView onOpenQuickAdd={handleQuickAddAction} />}

          {activeView === 'events' && (
            <EventsView onOpenEventModal={() => setEventModalOpen(true)} />
          )}

          {activeView === 'event_detail' && (
            <EventDetailView
              onBack={() => setActiveView('events')}
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
              onOpenExpenseModal={() => setExpenseModalOpen(true)}
              onOpenTeamAssignmentModal={() => setTeamModalOpen(true)}
            />
          )}

          {activeView === 'clients' && (
            <ClientsView onOpenClientModal={() => setClientModalOpen(true)} />
          )}

          {activeView === 'client_detail' && (
            <ClientDetailView
              onBack={() => setActiveView('clients')}
              onOpenEventModal={() => setEventModalOpen(true)}
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
            />
          )}

          {activeView === 'payments' && (
            <PaymentsView
              onOpenPaymentModal={() => setPaymentModalOpen(true)}
              onShowReceipt={handleShowReceipt}
            />
          )}

          {activeView === 'expenses' && (
            <ExpensesView onOpenExpenseModal={() => setExpenseModalOpen(true)} />
          )}

          {activeView === 'team' && (
            <TeamView onOpenTeamModal={() => setTeamModalOpen(true)} />
          )}

          {activeView === 'payables' && <PayablesView />}
          {activeView === 'receivables' && <ReceivablesView />}
          {activeView === 'tasks' && <TasksView />}
          {activeView === 'deliverables' && <DeliverablesView />}
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'reports' && <ReportsView />}

          {activeView === 'settings' && (
            <SettingsView
              onOpenIntegrationsTest={() => setActiveView('integrations_test')}
              onOpenSetupWizard={() => setActiveView('setup')}
            />
          )}

          {activeView === 'integrations_test' && <IntegrationsTestPage />}
          {activeView === 'audit_log' && <AuditLogView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenQuickAdd={() => setQuickAddOpen(true)} />

      {/* Modals & Dialogs */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSelectAction={handleQuickAddAction}
      />

      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
      />

      <ClientModal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSavedPayment={(payment) => handleShowReceipt(payment)}
      />

      <PaymentReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        payment={activePaymentForReceipt}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
      />

      <TeamMemberModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-amber-500/50 text-white font-bold text-xs shadow-2xl flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
