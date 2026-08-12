import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuditLogView() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          System Audit Trail & Log
        </h1>
        <p className="text-xs text-zinc-400">
          Security audit record tracking all creates, updates, payment entries, and sync events
        </p>
      </div>

      {auditLogs.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500 bg-zinc-950">
          No audit logs recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 glass-panel">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 text-amber-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Record Type</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/60 text-zinc-200">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/50 font-mono text-[11px]">
                  <td className="p-3.5 text-zinc-400">{log.Timestamp ? log.Timestamp.replace('T', ' ').substring(0, 19) : ''}</td>
                  <td className="p-3.5 font-bold text-white">{log.User}</td>
                  <td className="p-3.5 font-bold text-amber-400">{log.Action}</td>
                  <td className="p-3.5 text-zinc-300">{log.RecordType}</td>
                  <td className="p-3.5 text-zinc-400">{log.Details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
