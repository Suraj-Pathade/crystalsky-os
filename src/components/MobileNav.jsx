import React from 'react';
import { LayoutDashboard, Camera, Users, CreditCard, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MobileNav({ onOpenQuickAdd }) {
  const { activeView, setActiveView, setSelectedEventId, setSelectedClientId } = useApp();

  const handleNavClick = (id) => {
    if (id !== 'event_detail') setSelectedEventId(null);
    if (id !== 'client_detail') setSelectedClientId(null);
    setActiveView(id);
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'events', label: 'Shoots', icon: Camera },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              isActive
                ? 'text-amber-400 font-extrabold scale-105'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Center Quick Action Button */}
      <button
        onClick={onOpenQuickAdd}
        className="btn-gold p-2.5 rounded-full text-black shadow-lg hover:scale-110 active:scale-95 transition-transform -mt-4 border-2 border-zinc-950"
      >
        <Plus className="w-5 h-5 font-bold" />
      </button>
    </div>
  );
}
