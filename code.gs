function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupSheets(ss);
  
  // Check if this is a lightweight sync check request
  const urlParams = new URLSearchParams(PropertiesService.getScriptProperties().getProperty('url_params') || '');
  
  const leads = readSheet(ss.getSheetByName('Leads'));
  const activities = readSheet(ss.getSheetByName('Activities'));
  const tasks = readSheet(ss.getSheetByName('Tasks'));
  const users = readSheet(ss.getSheetByName('Users'));
  const logs = readSheet(ss.getSheetByName('Logs'));
  const interests = readSheet(ss.getSheetByName('Interests'));
  
  // Read Settings Sheet with dynamic column detection
  const settingsSheet = ss.getSheetByName('Settings');
  const settingsData = settingsSheet ? settingsSheet.getDataRange().getValues() : [];
  let locations = [];
  let sources = [];
  let taskTitles = [];
  let scriptUrl = '';
  let appTitle = '';
  
  if (settingsData.length > 0) {
    const headers = settingsData[0];
    const locationsCol = headers.indexOf('Locations');
    const sourcesCol = headers.indexOf('Sources');
    const scriptUrlCol = headers.indexOf('ScriptURL');
    const appTitleCol = headers.indexOf('AppTitle');
    const taskTitlesCol = headers.indexOf('TaskTitles');
    
    if (scriptUrlCol !== -1 && settingsData.length > 1) {
      scriptUrl = settingsData[1][scriptUrlCol] || '';
    }
    if (appTitleCol !== -1 && settingsData.length > 1) {
      appTitle = settingsData[1][appTitleCol] || '';
    }
    
    // Dynamically parse locations, sources, and task titles by column index
    for (let i = 1; i < settingsData.length; i++) {
      if (locationsCol !== -1 && settingsData[i][locationsCol]) locations.push(settingsData[i][locationsCol]);
      if (sourcesCol !== -1 && settingsData[i][sourcesCol]) sources.push(settingsData[i][sourcesCol]);
      if (taskTitlesCol !== -1 && settingsData[i][taskTitlesCol]) taskTitles.push(settingsData[i][taskTitlesCol]);
    }
  }

  // Re-nest activities and tasks using O(N) hash map approach instead of O(N*M)
  const activitiesMap = {};
  activities.forEach(a => {
    if (!activitiesMap[a.leadId]) activitiesMap[a.leadId] = [];
    activitiesMap[a.leadId].push(a);
  });
  
  const tasksMap = {};
  tasks.forEach(t => {
    if (!tasksMap[t.leadId]) tasksMap[t.leadId] = [];
    tasksMap[t.leadId].push(t);
  });
  
  leads.forEach(lead => {
    lead.activities = activitiesMap[lead.id] || [];
    lead.tasks = tasksMap[lead.id] || [];
    lead.value = parseFloat(lead.value) || 0;
  });

  const serverTime = new Date().getTime();
  const lastUpdate = parseInt(PropertiesService.getScriptProperties().getProperty('LAST_UPDATE') || 0);

  return ContentService.createTextOutput(JSON.stringify({
    leads: leads,
    users: users,
    logs: logs,
    interests: interests,
    settings: { locations: locations, sources: sources, taskTitles: taskTitles, scriptUrl: scriptUrl },
    config: { appTitle: appTitle },
    serverTime: serverTime,
    lastUpdate: lastUpdate
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupSheets(ss);
  
  // Use LockService to prevent race conditions during concurrent writes
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: 'Server busy. Please try again.' 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'save_all') {
      if(data.users) writeSheet(ss.getSheetByName('Users'), data.users, ['id', 'username', 'password', 'name', 'role']);
      if(data.logs) writeSheet(ss.getSheetByName('Logs'), data.logs, ['id', 'timestamp', 'message']);
      
      if(data.leads) {
        const flatLeads = data.leads.map(l => {
          const { activities, tasks, ...rest } = l; 
          return rest;
        });
        
        const flatActivities = [];
        const flatTasks = [];
        data.leads.forEach(l => {
          if (l.activities && Array.isArray(l.activities)) {
            l.activities.forEach(a => flatActivities.push({ ...a, leadId: l.id }));
          }
          if (l.tasks && Array.isArray(l.tasks)) {
            l.tasks.forEach(t => flatTasks.push({ ...t, leadId: l.id }));
          }
        });

        writeSheet(ss.getSheetByName('Leads'), flatLeads, ['id', 'name', 'phone', 'email', 'status', 'value', 'interest', 'location', 'source', 'assignedTo', 'notes', 'temperature', 'lostReason', 'createdAt']);
        writeSheet(ss.getSheetByName('Activities'), flatActivities, ['id', 'leadId', 'type', 'note', 'timestamp', 'createdBy', 'role']);
        writeSheet(ss.getSheetByName('Tasks'), flatTasks, ['id', 'leadId', 'title', 'status', 'dueDate', 'note', 'createdAt', 'completedAt']);
      }
      
      // Update the LAST_UPDATE timestamp after successful save
      updateLastModified();
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
    }
    // New: Save ScriptURL and AppName to Settings
    if (data.action === 'save_script_url' && (data.scriptUrl || data.appTitle)) {
      const settingsSheet = ss.getSheetByName('Settings');
      let settingsData = settingsSheet.getDataRange().getValues();
      // Ensure header row
      if (settingsData.length === 0) {
        settingsSheet.appendRow(['Locations', 'Sources', 'ScriptURL', 'AppTitle']);
        settingsData = settingsSheet.getDataRange().getValues();
      }
      // Find ScriptURL and AppTitle columns
      const headers = settingsData[0];
      let scriptUrlCol = headers.indexOf('ScriptURL');
      let appTitleCol = headers.indexOf('AppTitle');
      if (scriptUrlCol === -1) {
        scriptUrlCol = headers.length;
        headers.push('ScriptURL');
      }
      if (appTitleCol === -1) {
        appTitleCol = headers.length;
        headers.push('AppTitle');
      }
      settingsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      // Ensure at least one data row
      if (settingsData.length < 2) {
        const row = [];
        for (let i = 0; i < headers.length; i++) row.push('');
        settingsSheet.appendRow(row);
        settingsData = settingsSheet.getDataRange().getValues();
      }
      // Set ScriptURL and AppTitle values
      if (data.scriptUrl) settingsSheet.getRange(2, scriptUrlCol + 1).setValue(data.scriptUrl);
      if (data.appTitle) settingsSheet.getRange(2, appTitleCol + 1).setValue(data.appTitle);
      
      // Update the LAST_UPDATE timestamp
      updateLastModified();
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// --- Helpers ---
function setupSheets(ss) {
  const sheets = ['Leads', 'Activities', 'Tasks', 'Users', 'Logs', 'Interests', 'Settings'];
  sheets.forEach(name => {
    if (!ss.getSheetByName(name)) ss.insertSheet(name);
  });
}

function readSheet(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length < 2) return [];
  const headers = values.shift();
  return values.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function writeSheet(sheet, data, headers) {
  sheet.clearContents();
  if (data.length === 0) {
    sheet.appendRow(headers);
    return;
  }
  const output = [headers];
  data.forEach(item => {
    const row = headers.map(h => {
      const val = item[h];
      return val === undefined || val === null ? '' : val;
    });
    output.push(row);
  });
  sheet.getRange(1, 1, output.length, headers.length).setValues(output);
}

function updateLastModified() {
  PropertiesService.getScriptProperties().setProperty('LAST_UPDATE', new Date().getTime().toString());
}