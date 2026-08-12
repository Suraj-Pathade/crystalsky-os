/**
 * Dual-Mode Data Storage Engine for CrystalSky OS
 * Owner: Pravin Ghukshe (8412850833)
 * Brand: CrystalSky Photography & Film
 */

const STORAGE_KEYS = {
  SETTINGS: 'crystalsky_settings',
  CLIENTS: 'crystalsky_clients',
  EVENTS: 'crystalsky_events',
  PAYMENTS: 'crystalsky_payments',
  EXPENSES: 'crystalsky_expenses',
  TEAM: 'crystalsky_team',
  EVENT_TEAM: 'crystalsky_event_team',
  TASKS: 'crystalsky_tasks',
  DELIVERABLES: 'crystalsky_deliverables',
  NOTIFICATIONS: 'crystalsky_notifications',
  AUDIT_LOG: 'crystalsky_audit_log',
  COUNTERS: 'crystalsky_counters'
};

const DEFAULT_SETTINGS = {
  businessName: 'CrystalSky Photography & Film',
  ownerName: 'Pravin Ghukshe',
  ownerPhone: '8412850833',
  currency: '₹',
  defaultAdvance: 25000,
  googleScriptUrl: '',
  googleCalendarId: '',
  reminderDaysBefore: [7, 3, 1],
  eventTypes: ['Wedding', 'Pre-Wedding', 'Engagement', 'Reception', 'Haldi', 'Mehendi', 'Sangeet', 'Birthday', 'Corporate', 'Other'],
  expenseCategories: [
    'Photographer', 'Videographer', 'Candid', 'Cinematographer', 'Reel', 'Drone',
    'Video Editing', 'Photo Editing', 'Album Designing', 'Album Printing',
    'Travel', 'Fuel', 'Food', 'Equipment Rental', 'Camera Rental', 'Lens Rental',
    'Marketing', 'Software', 'Office', 'Miscellaneous'
  ],
  teamRoles: [
    'Photographer', 'Videographer', 'Candid Photographer', 'Cinematographer',
    'Reel Creator', 'Drone Operator', 'Video Editor', 'Photo Editor',
    'Album Designer', 'Album Printer', 'Other'
  ],
  paymentMethods: ['Cash', 'UPI', 'Bank Transfer', 'PhonePe', 'Google Pay', 'Other'],
  paymentTypes: ['Advance', 'Wedding Day', 'Final', 'Additional', 'Other']
};

function getItem(key, defaultValue = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

export function generateID(prefix) {
  const counters = getItem(STORAGE_KEYS.COUNTERS, {});
  const current = (counters[prefix] || 0) + 1;
  counters[prefix] = current;
  setItem(STORAGE_KEYS.COUNTERS, counters);
  return `${prefix}${String(current).padStart(3, '0')}`;
}

export const StorageService = {
  getSettings() {
    return getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    this.logAudit('Pravin Ghukshe', 'UPDATE', 'Settings', 'SYSTEM', 'Updated system settings');
    return updated;
  },

  getClients() {
    return getItem(STORAGE_KEYS.CLIENTS, []);
  },
  saveClient(clientData) {
    const clients = this.getClients();
    let client;
    if (clientData.ClientID) {
      const idx = clients.findIndex(c => c.ClientID === clientData.ClientID);
      client = { ...clients[idx], ...clientData, UpdatedAt: new Date().toISOString() };
      if (idx !== -1) clients[idx] = client;
      this.logAudit('Pravin Ghukshe', 'UPDATE', 'Clients', client.ClientID, `Updated client ${client.Name}`);
    } else {
      client = {
        ClientID: generateID('CL'),
        Name: clientData.Name || '',
        Phone: clientData.Phone || '',
        WhatsApp: clientData.WhatsApp || clientData.Phone || '',
        Email: clientData.Email || '',
        Address: clientData.Address || '',
        City: clientData.City || '',
        Instagram: clientData.Instagram || '',
        Notes: clientData.Notes || '',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };
      clients.push(client);
      this.logAudit('Pravin Ghukshe', 'CREATE', 'Clients', client.ClientID, `Created client ${client.Name}`);
    }
    setItem(STORAGE_KEYS.CLIENTS, clients);
    this.syncToGoogleSheets('addRecord', { tableName: 'Clients', record: client });
    return client;
  },
  deleteClient(clientID) {
    const clients = this.getClients().filter(c => c.ClientID !== clientID);
    setItem(STORAGE_KEYS.CLIENTS, clients);
    this.logAudit('Pravin Ghukshe', 'ARCHIVE', 'Clients', clientID, `Archived client ${clientID}`);
  },

  getEvents() {
    return getItem(STORAGE_KEYS.EVENTS, []);
  },
  saveEvent(eventData) {
    const events = this.getEvents();
    let event;
    if (eventData.EventID) {
      const idx = events.findIndex(e => e.EventID === eventData.EventID);
      event = { ...events[idx], ...eventData, UpdatedAt: new Date().toISOString() };
      if (idx !== -1) events[idx] = event;
      this.logAudit('Pravin Ghukshe', 'UPDATE', 'Events', event.EventID, `Updated event ${event.EventName}`);
    } else {
      event = {
        EventID: generateID('EV'),
        ClientID: eventData.ClientID || '',
        ClientName: eventData.ClientName || '',
        EventName: eventData.EventName || '',
        EventType: eventData.EventType || 'Wedding',
        EventDate: eventData.EventDate || '',
        StartTime: eventData.StartTime || '09:00',
        EndTime: eventData.EndTime || '21:00',
        Venue: eventData.Venue || '',
        Address: eventData.Address || '',
        City: eventData.City || '',
        GoogleMapsLink: eventData.GoogleMapsLink || '',
        ClientPhone: eventData.ClientPhone || '',
        TotalContractValue: Number(eventData.TotalContractValue || 0),
        PaymentSchedule: eventData.PaymentSchedule || [],
        EventStatus: eventData.EventStatus || 'Booked',
        ProductionStatus: eventData.ProductionStatus || 'BOOKED',
        Notes: eventData.Notes || '',
        CalendarEventID: eventData.CalendarEventID || '',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };
      events.push(event);
      this.logAudit('Pravin Ghukshe', 'CREATE', 'Events', event.EventID, `Created event ${event.EventName}`);
    }
    setItem(STORAGE_KEYS.EVENTS, events);
    this.syncToGoogleSheets('addRecord', { tableName: 'Events', record: event });
    return event;
  },
  deleteEvent(eventID) {
    const events = this.getEvents().filter(e => e.EventID !== eventID);
    setItem(STORAGE_KEYS.EVENTS, events);
    this.logAudit('Pravin Ghukshe', 'ARCHIVE', 'Events', eventID, `Archived event ${eventID}`);
  },

  getPayments() {
    return getItem(STORAGE_KEYS.PAYMENTS, []);
  },
  savePayment(paymentData) {
    const payments = this.getPayments();
    const payment = {
      PaymentID: generateID('PAY'),
      EventID: paymentData.EventID || '',
      ClientID: paymentData.ClientID || '',
      ClientName: paymentData.ClientName || '',
      EventName: paymentData.EventName || '',
      PaymentDate: paymentData.PaymentDate || new Date().toISOString().split('T')[0],
      Amount: Number(paymentData.Amount || 0),
      PaymentMethod: paymentData.PaymentMethod || 'UPI',
      PaymentType: paymentData.PaymentType || 'Advance',
      ReferenceNumber: paymentData.ReferenceNumber || '',
      Notes: paymentData.Notes || '',
      CreatedAt: new Date().toISOString()
    };
    payments.push(payment);
    setItem(STORAGE_KEYS.PAYMENTS, payments);
    this.logAudit('Pravin Ghukshe', 'PAYMENT', 'Payments', payment.PaymentID, `Recorded payment of ₹${payment.Amount} for ${payment.ClientName}`);
    this.syncToGoogleSheets('addRecord', { tableName: 'Payments', record: payment });
    return payment;
  },

  getExpenses() {
    return getItem(STORAGE_KEYS.EXPENSES, []);
  },
  saveExpense(expenseData) {
    const expenses = this.getExpenses();
    let expense;
    if (expenseData.ExpenseID) {
      const idx = expenses.findIndex(e => e.ExpenseID === expenseData.ExpenseID);
      expense = { ...expenses[idx], ...expenseData };
      if (idx !== -1) expenses[idx] = expense;
      this.logAudit('Pravin Ghukshe', 'UPDATE', 'Expenses', expense.ExpenseID, `Updated expense ₹${expense.Amount}`);
    } else {
      expense = {
        ExpenseID: generateID('EXP'),
        Date: expenseData.Date || new Date().toISOString().split('T')[0],
        EventID: expenseData.EventID || '',
        ClientID: expenseData.ClientID || '',
        Category: expenseData.Category || 'Miscellaneous',
        Subcategory: expenseData.Subcategory || '',
        PersonVendor: expenseData.PersonVendor || '',
        Description: expenseData.Description || '',
        Amount: Number(expenseData.Amount || 0),
        PaymentMethod: expenseData.PaymentMethod || 'Cash',
        PaidBy: expenseData.PaidBy || 'Pravin Ghukshe',
        PaymentStatus: expenseData.PaymentStatus || 'Paid',
        ReceiptURL: expenseData.ReceiptURL || '',
        Notes: expenseData.Notes || '',
        CreatedAt: new Date().toISOString()
      };
      expenses.push(expense);
      this.logAudit('Pravin Ghukshe', 'EXPENSE', 'Expenses', expense.ExpenseID, `Added expense of ₹${expense.Amount} [${expense.Category}]`);
    }
    setItem(STORAGE_KEYS.EXPENSES, expenses);
    this.syncToGoogleSheets('addRecord', { tableName: 'Expenses', record: expense });
    return expense;
  },
  deleteExpense(expenseID) {
    const expenses = this.getExpenses().filter(e => e.ExpenseID !== expenseID);
    setItem(STORAGE_KEYS.EXPENSES, expenses);
    this.logAudit('Pravin Ghukshe', 'DELETE', 'Expenses', expenseID, `Deleted expense ${expenseID}`);
  },

  getTeam() {
    return getItem(STORAGE_KEYS.TEAM, []);
  },
  saveTeamMember(memberData) {
    const team = this.getTeam();
    let member;
    if (memberData.PersonID) {
      const idx = team.findIndex(t => t.PersonID === memberData.PersonID);
      member = { ...team[idx], ...memberData };
      if (idx !== -1) team[idx] = member;
      this.logAudit('Pravin Ghukshe', 'UPDATE', 'Team', member.PersonID, `Updated team member ${member.Name}`);
    } else {
      member = {
        PersonID: generateID('TEAM'),
        Name: memberData.Name || '',
        Phone: memberData.Phone || '',
        WhatsApp: memberData.WhatsApp || memberData.Phone || '',
        Role: memberData.Role || 'Photographer',
        Category: memberData.Category || 'Freelancer',
        Notes: memberData.Notes || '',
        Active: true,
        CreatedAt: new Date().toISOString()
      };
      team.push(member);
      this.logAudit('Pravin Ghukshe', 'CREATE', 'Team', member.PersonID, `Added team member ${member.Name}`);
    }
    setItem(STORAGE_KEYS.TEAM, team);
    this.syncToGoogleSheets('addRecord', { tableName: 'Team', record: member });
    return member;
  },

  getEventTeamAssignments() {
    return getItem(STORAGE_KEYS.EVENT_TEAM, []);
  },
  saveEventTeamAssignment(assignmentData) {
    const assignments = this.getEventTeamAssignments();
    let assignment;
    const agreed = Number(assignmentData.AgreedAmount || 0);
    const paid = Number(assignmentData.PaidAmount || 0);
    const pending = agreed - paid;
    
    if (assignmentData.AssignmentID) {
      const idx = assignments.findIndex(a => a.AssignmentID === assignmentData.AssignmentID);
      assignment = {
        ...assignments[idx],
        ...assignmentData,
        AgreedAmount: agreed,
        PaidAmount: paid,
        PendingAmount: pending,
        PaymentStatus: pending <= 0 ? 'PAID' : paid > 0 ? 'PARTIALLY PAID' : 'UNPAID'
      };
      if (idx !== -1) assignments[idx] = assignment;
    } else {
      assignment = {
        AssignmentID: generateID('ET'),
        EventID: assignmentData.EventID || '',
        PersonID: assignmentData.PersonID || '',
        PersonName: assignmentData.PersonName || '',
        Role: assignmentData.Role || '',
        AgreedAmount: agreed,
        PaidAmount: paid,
        PendingAmount: pending,
        PaymentStatus: pending <= 0 ? 'PAID' : paid > 0 ? 'PARTIALLY PAID' : 'UNPAID',
        PaymentDate: assignmentData.PaymentDate || '',
        Notes: assignmentData.Notes || ''
      };
      assignments.push(assignment);
    }
    setItem(STORAGE_KEYS.EVENT_TEAM, assignments);
    this.logAudit('Pravin Ghukshe', 'ASSIGN_TEAM', 'EventTeam', assignment.AssignmentID, `Assigned ${assignment.PersonName} to event`);
    return assignment;
  },

  getTasks() {
    return getItem(STORAGE_KEYS.TASKS, []);
  },
  saveTask(taskData) {
    const tasks = this.getTasks();
    let task;
    if (taskData.TaskID) {
      const idx = tasks.findIndex(t => t.TaskID === taskData.TaskID);
      task = { ...tasks[idx], ...taskData };
      if (task.Status === 'COMPLETED' && !task.CompletedAt) {
        task.CompletedAt = new Date().toISOString();
      }
      if (idx !== -1) tasks[idx] = task;
    } else {
      task = {
        TaskID: generateID('TSK'),
        TaskName: taskData.TaskName || '',
        EventID: taskData.EventID || '',
        ClientID: taskData.ClientID || '',
        AssignedTo: taskData.AssignedTo || 'Pravin Ghukshe',
        Category: taskData.Category || 'General',
        Priority: taskData.Priority || 'MEDIUM',
        DueDate: taskData.DueDate || new Date().toISOString().split('T')[0],
        Status: taskData.Status || 'TODO',
        Notes: taskData.Notes || '',
        CreatedAt: new Date().toISOString(),
        CompletedAt: taskData.Status === 'COMPLETED' ? new Date().toISOString() : ''
      };
      tasks.push(task);
    }
    setItem(STORAGE_KEYS.TASKS, tasks);
    this.logAudit('Pravin Ghukshe', 'TASK', 'Tasks', task.TaskID, `Saved task ${task.TaskName}`);
    return task;
  },

  getDeliverables() {
    return getItem(STORAGE_KEYS.DELIVERABLES, []);
  },
  saveDeliverable(delivData) {
    const items = this.getDeliverables();
    let item;
    if (delivData.DeliverableID) {
      const idx = items.findIndex(d => d.DeliverableID === delivData.DeliverableID);
      item = { ...items[idx], ...delivData, UpdatedAt: new Date().toISOString() };
      if (idx !== -1) items[idx] = item;
    } else {
      item = {
        DeliverableID: generateID('DEL'),
        EventID: delivData.EventID || '',
        EventName: delivData.EventName || '',
        ClientName: delivData.ClientName || '',
        Type: delivData.Type || 'Photos',
        Status: delivData.Status || 'NOT STARTED',
        DueDate: delivData.DueDate || '',
        DeliveredDate: delivData.Status === 'DELIVERED' ? new Date().toISOString().split('T')[0] : '',
        Notes: delivData.Notes || '',
        UpdatedAt: new Date().toISOString()
      };
      items.push(item);
    }
    setItem(STORAGE_KEYS.DELIVERABLES, items);
    return item;
  },

  getAuditLogs() {
    return getItem(STORAGE_KEYS.AUDIT_LOG, []);
  },
  logAudit(user, action, recordType, recordId, details) {
    const logs = this.getAuditLogs();
    const log = {
      Timestamp: new Date().toISOString(),
      User: user || 'Pravin Ghukshe',
      Action: action,
      RecordType: recordType,
      RecordID: recordId,
      Details: details
    };
    logs.unshift(log);
    setItem(STORAGE_KEYS.AUDIT_LOG, logs.slice(0, 500));
  },

  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.logAudit('Pravin Ghukshe', 'CLEAR', 'System', 'ALL', 'Database reset to empty state');
  },

  async syncToGoogleSheets(action, payload = {}) {
    const settings = this.getSettings();
    if (!settings.googleScriptUrl) return;
    
    try {
      await fetch(settings.googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
        mode: 'no-cors'
      });
    } catch (e) {
      console.warn('Google Sheets sync error:', e);
    }
  }
};
