import React from 'react';
import { 
  LayoutDashboard, Calendar, Users, CreditCard, Receipt, 
  UserCheck, CheckSquare, PackageCheck, FileSpreadsheet, 
  TrendingDown, TrendingUp, Settings, ShieldCheck, Camera, ChevronRight, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';

export default function Sidebar() {
  const { activeView, setActiveView, setSelectedEventId, setSelectedClientId, lockApp } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Shoots & Bookings', icon: Camera },
    { id: 'clients', label: 'Client Directory', icon: Users },
    { id: 'payments', label: 'Client Payments', icon: CreditCard },
    { id: 'expenses', label: 'Monthly Expenses', icon: Receipt },
    { id: 'team', label: 'Team & Freelancers', icon: UserCheck },
    { id: 'payables', label: 'Freelancer Payables', icon: TrendingDown },
    { id: 'receivables', label: 'Client Dues (Receivables)', icon: TrendingUp },
    { id: 'tasks', label: 'Tasks & To-Dos', icon: CheckSquare },
    { id: 'deliverables', label: 'Deliverables & Albums', icon: PackageCheck },
    { id: 'calendar', label: 'Shoot Calendar', icon: Calendar },
    { id: 'reports', label: 'Financial P&L Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings & Cloud Sync', icon: Settings },
    { id: 'audit_log', label: 'Security Audit Log', icon: ShieldCheck }
  ];

  const handleNavClick = (id) => {
    if (id !== 'event_detail') setSelectedEventId(null);
    if (id !== 'client_detail') setSelectedClientId(null);
    setActiveView(id);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 min-h-screen sticky top-0 h-screen select-none">
      {/* Luxury Logo Header */}
      <div className="p-4 border-b border-zinc-800/80">
        <Logo size="md" />
      </div>

      {/* Owner Profile Banner */}
      <div className="mx-3 my-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/90 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black font-extrabold text-xs flex items-center justify-center shadow-md">
            PG
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-white truncate">Pravin Ghukshe</p>
            <p className="text-[10px] text-amber-400 font-mono font-bold">8412850833</p>
          </div>
        </div>

        <button
          onClick={lockApp}
          title="Lock System & Sign Out"
          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-500" />}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 text-[11px] text-zinc-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </span>
        <span className="font-mono text-[10px] text-zinc-600">v1.0.0</span>
      </div>
    </aside>
  );
}
