import React, { useState } from 'react';
import { 
  LayoutDashboard, Camera, CreditCard, Receipt, Menu, X, 
  Users, UserCheck, TrendingDown, TrendingUp, CheckSquare, 
  PackageCheck, Calendar, FileSpreadsheet, Settings, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MobileNav({ onOpenQuickAdd }) {
  const { activeView, setActiveView } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'events', label: 'Shoots', icon: Camera },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
  ];

  const drawerItems = [
    { id: 'clients', label: 'Clients Directory', icon: Users },
    { id: 'team', label: 'Freelancers & Team', icon: UserCheck },
    { id: 'receivables', label: 'Client Receivables', icon: TrendingUp },
    { id: 'payables', label: 'Team Payables', icon: TrendingDown },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'deliverables', label: 'Deliverables', icon: PackageCheck },
    { id: 'calendar', label: 'Calendar View', icon: Calendar },
    { id: 'reports', label: 'P&L Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings & Integrations', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveView(id);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Drawer Overlay for Mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-4/5 max-w-xs bg-zinc-950 border-l border-zinc-800 h-full flex flex-col p-4">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <div>
                  <h2 className="font-bold text-sm text-white">CrystalSky OS</h2>
                  <p className="text-[10px] text-amber-500">Suraj Pathade</p>
                </div>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-medium ${
                      isActive ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-500" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-800">
              <button
                onClick={() => { setDrawerOpen(false); onOpenQuickAdd(); }}
                className="w-full btn-gold py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                Quick Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/90 px-2 py-2 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 scale-110' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Floating Quick Action Button */}
        <button
          onClick={onOpenQuickAdd}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Menu Toggle Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium ${
            drawerOpen ? 'text-amber-400' : 'text-zinc-400'
          }`}
        >
          <Menu className="w-5 h-5 text-zinc-500" />
          <span>More</span>
        </button>
      </div>
    </>
  );
}
