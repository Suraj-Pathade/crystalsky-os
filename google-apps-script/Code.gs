/**
 * CRYSTALSKY OS - Google Apps Script Backend Code
 * Owner: Pravin Ghukshe (8412850833)
 * Brand: CrystalSky Photography & Film
 * 
 * Paste this file into Extensions > Apps Script in your Google Spreadsheet.
 * Deploy as Web App -> Execute as: Me -> Access: Anyone.
 */

const SHEET_NAMES = {
  SETTINGS: 'Settings',
  CLIENTS: 'Clients',
  EVENTS: 'Events',
  EVENT_FUNCTIONS: 'EventFunctions',
  PAYMENTS: 'Payments',
  EXPENSES: 'Expenses',
  TEAM: 'Team',
  EVENT_TEAM: 'EventTeam',
  TASKS: 'Tasks',
  DELIVERABLES: 'Deliverables',
  NOTIFICATIONS: 'Notifications',
  CALENDAR_EVENTS: 'CalendarEvents',
  REPORTS: 'Reports',
  AUDIT_LOG: 'AuditLog'
};

function doGet(e) {
  const action = e ? (e.parameter ? e.parameter.action : 'ping') : 'ping';
  let responseData = { success: true };

  try {
    if (action === 'ping') {
      responseData.message = 'CrystalSky OS API is live';
      responseData.owner = 'Pravin Ghukshe';
      responseData.phone = '8412850833';
      responseData.timestamp = new Date().toISOString();
    } else if (action === 'getAllData') {
      responseData.data = fetchAllDataFromSheets();
    } else if (action === 'getSettings') {
      responseData.settings = getTableData(SHEET_NAMES.SETTINGS);
    } else if (action === 'getClients') {
      responseData.clients = getTableData(SHEET_NAMES.CLIENTS);
    } else if (action === 'getEvents') {
      responseData.events = getTableData(SHEET_NAMES.EVENTS);
    } else if (action === 'getPayments') {
      responseData.payments = getTableData(SHEET_NAMES.PAYMENTS);
    } else if (action === 'getExpenses') {
      responseData.expenses = getTableData(SHEET_NAMES.EXPENSES);
    } else if (action === 'getTeam') {
      responseData.team = getTableData(SHEET_NAMES.TEAM);
    } else if (action === 'getTasks') {
      responseData.tasks = getTableData(SHEET_NAMES.TASKS);
    } else if (action === 'getDeliverables') {
      responseData.deliverables = getTableData(SHEET_NAMES.DELIVERABLES);
    } else {
      responseData.success = false;
      responseData.error = 'Unknown action: ' + action;
    }
  } catch (err) {
    responseData.success = false;
    responseData.error = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let responseData = { success: true };
  
  try {
    let postData = {};
    if (e && e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    }
    
    const action = postData.action || (e && e.parameter ? e.parameter.action : '');

    if (action === 'initializeSystem') {
      responseData = initializeSpreadsheetStructure();
    } else if (action === 'syncAllData') {
      responseData = saveAllDataToSheets(postData.data);
    } else if (action === 'addRecord') {
      responseData = addRecordToSheet(postData.tableName, postData.record);
    } else if (action === 'updateRecord') {
      responseData = updateRecordInSheet(postData.tableName, postData.recordId, postData.record);
    } else if (action === 'deleteRecord') {
      responseData = archiveRecordInSheet(postData.tableName, postData.recordId);
    } else if (action === 'syncCalendar') {
      responseData = handleCalendarSync(postData.eventRecord);
    } else {
      responseData.success = false;
      responseData.error = 'Invalid POST action: ' + action;
    }
  } catch (err) {
    responseData.success = false;
    responseData.error = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function initializeSpreadsheetStructure() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const headersMap = {
    [SHEET_NAMES.SETTINGS]: ['Key', 'Value', 'UpdatedAt'],
    [SHEET_NAMES.CLIENTS]: ['ClientID', 'Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'City', 'Instagram', 'Notes', 'CreatedAt', 'UpdatedAt'],
    [SHEET_NAMES.EVENTS]: ['EventID', 'ClientID', 'ClientName', 'EventName', 'EventType', 'EventDate', 'StartTime', 'EndTime', 'Venue', 'Address', 'City', 'GoogleMapsLink', 'ClientPhone', 'TotalContractValue', 'EventStatus', 'ProductionStatus', 'Notes', 'CalendarEventID', 'CreatedAt', 'UpdatedAt'],
    [SHEET_NAMES.EVENT_FUNCTIONS]: ['FunctionID', 'EventID', 'FunctionName', 'FunctionDate', 'StartTime', 'Venue', 'Notes'],
    [SHEET_NAMES.PAYMENTS]: ['PaymentID', 'EventID', 'ClientID', 'ClientName', 'PaymentDate', 'Amount', 'PaymentMethod', 'PaymentType', 'ReferenceNumber', 'Notes', 'CreatedAt'],
    [SHEET_NAMES.EXPENSES]: ['ExpenseID', 'Date', 'EventID', 'ClientID', 'Category', 'Subcategory', 'PersonVendor', 'Description', 'Amount', 'PaymentMethod', 'PaidBy', 'PaymentStatus', 'ReceiptURL', 'Notes', 'CreatedAt'],
    [SHEET_NAMES.TEAM]: ['PersonID', 'Name', 'Phone', 'WhatsApp', 'Role', 'Category', 'Notes', 'Active', 'CreatedAt'],
    [SHEET_NAMES.EVENT_TEAM]: ['AssignmentID', 'EventID', 'PersonID', 'PersonName', 'Role', 'AgreedAmount', 'PaidAmount', 'PendingAmount', 'PaymentStatus', 'PaymentDate', 'Notes'],
    [SHEET_NAMES.TASKS]: ['TaskID', 'TaskName', 'EventID', 'ClientID', 'AssignedTo', 'Category', 'Priority', 'DueDate', 'Status', 'Notes', 'CreatedAt', 'CompletedAt'],
    [SHEET_NAMES.DELIVERABLES]: ['DeliverableID', 'EventID', 'EventName', 'ClientName', 'Type', 'Status', 'DueDate', 'DeliveredDate', 'Notes', 'UpdatedAt'],
    [SHEET_NAMES.NOTIFICATIONS]: ['NotificationID', 'Title', 'Message', 'Type', 'RelatedID', 'ReadStatus', 'CreatedAt'],
    [SHEET_NAMES.CALENDAR_EVENTS]: ['EventID', 'CalendarEventID', 'Title', 'Date', 'SyncStatus', 'LastSynced'],
    [SHEET_NAMES.REPORTS]: ['ReportID', 'PeriodType', 'StartDate', 'EndDate', 'TotalRevenue', 'TotalExpense', 'NetProfit', 'GeneratedAt'],
    [SHEET_NAMES.AUDIT_LOG]: ['Timestamp', 'User', 'Action', 'RecordType', 'RecordID', 'Details']
  };

  Object.keys(headersMap).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    sheet.clear();
    const headers = headersMap[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1f2937').setFontColor('#f59e0b');
    sheet.setFrozenRows(1);
  });

  const settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  const defaultSettings = [
    ['BusinessName', 'CrystalSky Photography & Film', new Date().toISOString()],
    ['OwnerName', 'Pravin Ghukshe', new Date().toISOString()],
    ['OwnerPhone', '8412850833', new Date().toISOString()],
    ['Currency', '₹', new Date().toISOString()],
    ['DefaultAdvance', '25000', new Date().toISOString()],
    ['InitializedAt', new Date().toISOString(), new Date().toISOString()]
  ];
  settingsSheet.getRange(2, 1, defaultSettings.length, 3).setValues(defaultSettings);

  logAuditAction('System', 'INITIALIZE', 'System', 'ALL', 'Spreadsheet structure initialized for Pravin Ghukshe');

  return { success: true, message: 'All 14 sheet tabs initialized successfully for Pravin Ghukshe!' };
}

function getTableData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx];
    });
    return obj;
  });
}

function fetchAllDataFromSheets() {
  let result = {};
  Object.keys(SHEET_NAMES).forEach(key => {
    const tableName = SHEET_NAMES[key];
    result[tableName] = getTableData(tableName);
  });
  return result;
}

function saveAllDataToSheets(allData) {
  if (!allData) return { success: false, error: 'No data provided' };
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Object.keys(allData).forEach(sheetName => {
    const rows = allData[sheetName];
    if (!Array.isArray(rows)) return;
    
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) return;
    
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, lastCol).clearContent();
    }
    
    if (rows.length > 0) {
      const values = rows.map(item => {
        return headers.map(h => item[h] !== undefined && item[h] !== null ? item[h] : '');
      });
      sheet.getRange(2, 1, values.length, headers.length).setValues(values);
    }
  });

  logAuditAction('Pravin Ghukshe', 'FULL_SYNC', 'Database', 'ALL', 'Full data sync executed');
  return { success: true, timestamp: new Date().toISOString() };
}

function addRecordToSheet(tableName, record) {
  if (!tableName || !record) return { success: false, error: 'Missing table or record' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(tableName);
  if (!sheet) return { success: false, error: 'Table sheet not found: ' + tableName };

  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return { success: false, error: 'Sheet header missing' };

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const rowValues = headers.map(h => record[h] !== undefined && record[h] !== null ? record[h] : '');
  
  sheet.appendRow(rowValues);
  logAuditAction('Pravin Ghukshe', 'ADD_RECORD', tableName, String(record[headers[0]] || 'NEW'), 'Runtime record inserted');

  return { success: true, message: 'Record saved to Google Sheet at runtime!' };
}

function updateRecordInSheet(tableName, recordId, record) {
  if (!tableName || !recordId || !record) return { success: false, error: 'Missing table, ID, or record' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(tableName);
  if (!sheet) return { success: false, error: 'Table sheet not found: ' + tableName };

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return addRecordToSheet(tableName, record);

  const headers = data[0];
  let targetRowIdx = -1;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(recordId)) {
      targetRowIdx = i + 1;
      break;
    }
  }

  if (targetRowIdx === -1) {
    return addRecordToSheet(tableName, record);
  }

  const rowValues = headers.map(h => record[h] !== undefined && record[h] !== null ? record[h] : '');
  sheet.getRange(targetRowIdx, 1, 1, rowValues.length).setValues([rowValues]);

  logAuditAction('Pravin Ghukshe', 'UPDATE_RECORD', tableName, String(recordId), 'Runtime record updated');
  return { success: true, message: 'Record updated in Google Sheet at runtime!' };
}

function archiveRecordInSheet(tableName, recordId) {
  if (!tableName || !recordId) return { success: false, error: 'Missing table or ID' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(tableName);
  if (!sheet) return { success: false, error: 'Table sheet not found: ' + tableName };

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: false, error: 'Sheet empty' };

  let targetRowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(recordId)) {
      targetRowIdx = i + 1;
      break;
    }
  }

  if (targetRowIdx !== -1) {
    sheet.deleteRow(targetRowIdx);
    logAuditAction('Pravin Ghukshe', 'DELETE_RECORD', tableName, String(recordId), 'Runtime record deleted');
  }

  return { success: true, message: 'Record deleted from Google Sheet' };
}

function handleCalendarSync(eventRecord) {
  if (!eventRecord || !eventRecord.EventName || !eventRecord.EventDate) {
    return { success: false, error: 'Missing required event fields' };
  }
  
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const title = '📸 ' + eventRecord.EventName + ' — CrystalSky';
    const description = `Client: ${eventRecord.ClientName}\nPhone: ${eventRecord.ClientPhone || 'N/A'}\nVenue: ${eventRecord.Venue || 'N/A'}\nAddress: ${eventRecord.Address || 'N/A'}\nCity: ${eventRecord.City || ''}\nGoogle Maps: ${eventRecord.GoogleMapsLink || 'N/A'}\nContract: ₹${eventRecord.TotalContractValue || 0}\nStatus: ${eventRecord.EventStatus || 'Upcoming'}`;
    
    const startDate = new Date(eventRecord.EventDate);
    const endDate = new Date(eventRecord.EventDate);
    endDate.setHours(endDate.getHours() + 8);
    
    let calEvent;
    if (eventRecord.CalendarEventID) {
      try {
        calEvent = calendar.getEventById(eventRecord.CalendarEventID);
        if (calEvent) {
          calEvent.setTitle(title);
          calEvent.setDescription(description);
          calEvent.setTime(startDate, endDate);
        }
      } catch (e) {
        calEvent = null;
      }
    }
    
    if (!calEvent) {
      calEvent = calendar.createEvent(title, startDate, endDate, {
        description: description,
        location: eventRecord.Address || eventRecord.Venue || ''
      });
    }
    
    logAuditAction('Pravin Ghukshe', 'CALENDAR_SYNC', 'Events', eventRecord.EventID, 'Synced to Google Calendar');
    
    return {
      success: true,
      calendarEventId: calEvent.getId(),
      message: 'Google Calendar event created/updated successfully'
    };
  } catch (err) {
    return { success: false, error: 'Calendar sync failed: ' + err.toString() };
  }
}

function logAuditAction(user, action, recordType, recordId, details) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAMES.AUDIT_LOG);
    if (sheet) {
      sheet.appendRow([new Date().toISOString(), user, action, recordType, recordId, details]);
    }
  } catch (e) {
    // Ignore
  }
}
