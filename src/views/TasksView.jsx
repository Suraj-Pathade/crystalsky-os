import React, { useState } from 'react';
import { CheckSquare, Plus, Calendar, UserCheck, AlertTriangle, CheckCircle2, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TasksView() {
  const { tasks, events, saveTask, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [taskName, setTaskName] = useState('');
  const [eventId, setEventId] = useState('');
  const [assignedTo, setAssignedTo] = useState('Pravin Ghukshe');
  const [category, setCategory] = useState('Editing');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTaskName('');
    setEventId('');
    setAssignedTo('Pravin Ghukshe');
    setCategory('Editing');
    setPriority('MEDIUM');
    setDueDate(new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTaskName(task.TaskName || '');
    setEventId(task.EventID || '');
    setAssignedTo(task.AssignedTo || 'Pravin Ghukshe');
    setCategory(task.Category || 'Editing');
    setPriority(task.Priority || 'MEDIUM');
    setDueDate(task.DueDate || new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const handleToggleComplete = (task) => {
    const newStatus = task.Status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    saveTask({ ...task, Status: newStatus });
    showToast(`Task "${task.TaskName}" marked as ${newStatus}`);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskName) return;

    const payload = {
      TaskID: editingTask ? editingTask.TaskID : undefined,
      TaskName: taskName,
      EventID: eventId,
      AssignedTo: assignedTo,
      Category: category,
      Priority: priority,
      DueDate: dueDate,
      Status: editingTask ? editingTask.Status : 'TODO'
    };

    saveTask(payload);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-purple-400" />
            Task & Production To-Do Management
          </h1>
          <p className="text-xs text-zinc-400">
            Track editing tasks, photo selection, album design approvals, and client deliveries
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          + Add New Task
        </button>
      </div>

      {/* Task Cards List */}
      {tasks.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-950">
          <CheckSquare className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Tasks Created</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Your task list is completely empty. Create a task to track editing or delivery deadlines.
          </p>
          <button
            onClick={handleOpenCreate}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((t) => {
            const linkedEv = events.find(e => e.EventID === t.EventID);
            const isDone = t.Status === 'COMPLETED';

            return (
              <div
                key={t.TaskID}
                className={`p-4 rounded-2xl glass-panel space-y-3 flex flex-col justify-between transition-all ${
                  isDone ? 'opacity-60 bg-zinc-950/40' : 'hover:border-amber-500/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleComplete(t)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isDone ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-700 hover:border-amber-500'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <h3 className={`font-bold text-sm text-white ${isDone ? 'line-through text-zinc-500' : ''}`}>
                        {t.TaskName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.Priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        t.Priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {t.Priority}
                      </span>

                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 hover:bg-amber-500/20"
                        title="Edit Task Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {linkedEv && <p className="text-xs text-amber-400 font-medium">📸 Event: {linkedEv.EventName}</p>}
                </div>

                <div className="flex justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80 font-mono">
                  <span>Assigned: {t.AssignedTo}</span>
                  <span>Due: {t.DueDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Edit / Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 animate-modal shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">
              {editingTask ? 'Edit Task / To-Do' : 'Create New Task'}
            </h3>
            <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Task Description (e.g. Complete Video Teaser Edit)"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Link to Event (Optional)</label>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2"
                >
                  <option value="">-- Link to Event (Optional) --</option>
                  {events.map(ev => (
                    <option key={ev.EventID} value={ev.EventID}>{ev.EventName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Assigned Person</label>
                  <input
                    type="text"
                    placeholder="Assigned Person"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold py-2.5 rounded-xl text-xs font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
