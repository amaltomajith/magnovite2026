/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - EVENTS & DYNAMIC REGISTRATION WEB APP
 * ==============================================================================
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open your Google Sheet.
 *    - Sheet Tab "Events": Columns (Title | Description | Category)
 *    - Sheet Tab "Fields": Columns (Key | Label | Type | Required | Options)
 *    - Sheet Tab "Settings": Columns (Key | Value) -> e.g., Row 2: EventCode | MAG
 *    - Sheet Tab "Registrations": Will be auto-created on first registration submission.
 * 2. Click Extensions > Apps Script.
 * 3. Replace default code with this file's code.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 *    - Description: "Events & Dynamic Registration API Endpoint"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone"
 * 6. Click "Deploy" and copy the Web App URL (ends with "/exec").
 * 
 * CRITICAL DEPLOYMENT & SCHEMA UPDATE RULES:
 * - SCHEMA UPDATES VIA GOOGLE SHEETS: Adding, removing, or reordering rows in the
 *   "Fields" tab changes the live registration form instantly on the next page load,
 *   with ZERO redeployment required!
 * - SCRIPT CODE UPDATES: Any future modifications made to THIS Google Apps Script file
 *   require creating a NEW DEPLOYMENT VERSION (Deploy > Manage deployments > Edit > New version > Deploy)
 *   in order for script logic changes to take effect.
 * ==============================================================================
 */

function doGet(e) {
  try {
    var action = e && e.parameter && e.parameter.action ? String(e.parameter.action).toLowerCase() : "";

    if (action === "fields") {
      return getFormFieldsSchema();
    }

    // Default action: Fetch Events list
    return getEventsList();
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    return registerParticipant(payload);
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Reads form field definitions from "Fields" tab
 */
function getFormFieldsSchema() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Fields");

  // Fallback default schema if "Fields" tab is missing or empty
  if (!sheet || sheet.getLastRow() <= 1) {
    var defaultFields = [
      { key: "fullName", label: "Full Name", type: "text", required: true },
      { key: "email", label: "Email Address", type: "email", required: true },
      { key: "phone", label: "Phone Number", type: "tel", required: true },
      { key: "college", label: "College / University", type: "text", required: true },
      { key: "eventChoice", label: "Select Event", type: "select", required: true, options: ["Robo Soccer", "Code Relay", "Battle of the Bands", "Acapella", "Reverse Coding", "Chamber of Secrets", "CAD Design", "Spark Tank"] }
    ];
    return createJsonResponse(defaultFields);
  }

  var data = sheet.getDataRange().getValues();
  var fields = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var key = row[0] !== undefined && row[0] !== null ? String(row[0]).trim() : "";
    var label = row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : "";
    var type = row[2] !== undefined && row[2] !== null ? String(row[2]).trim().toLowerCase() : "text";
    var requiredVal = row[3];
    var optionsRaw = row[4] !== undefined && row[4] !== null ? String(row[4]).trim() : "";

    if (!key || !label) continue;

    var isRequired = requiredVal === true || String(requiredVal).toLowerCase() === "true" || requiredVal === 1;
    var optionsArray = [];

    if (optionsRaw) {
      optionsArray = optionsRaw.split(",").map(function(item) { return item.trim(); }).filter(Boolean);
    }

    var fieldObj = {
      key: key,
      label: label,
      type: type,
      required: isRequired
    };

    if (type === "select" && optionsArray.length > 0) {
      fieldObj.options = optionsArray;
    }

    fields.push(fieldObj);
  }

  return createJsonResponse(fields);
}

/**
 * Reads events list from "Events" tab
 */
function getEventsList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Events");

  if (!sheet || sheet.getLastRow() <= 1) {
    return createJsonResponse([]);
  }

  var data = sheet.getDataRange().getValues();
  var events = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var title = row[0] !== undefined && row[0] !== null ? String(row[0]).trim() : "";
    var desc = row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : "";
    var category = row[2] !== undefined && row[2] !== null ? String(row[2]).trim() : "";

    if (!title && !desc && !category) continue;

    events.push({
      title: title,
      desc: desc,
      category: category
    });
  }

  return createJsonResponse(events);
}

/**
 * Handles FCFS participant registration with automatic Chest Number assignment
 */
function registerParticipant(payload) {
  var lock = LockService.getScriptLock();
  
  try {
    // Acquire lock with 10s timeout to prevent race conditions during simultaneous registrations
    lock.waitLock(10000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Get EventCode prefix from "Settings" tab
    var eventCode = "MAG";
    var settingsSheet = ss.getSheetByName("Settings");
    if (settingsSheet && settingsSheet.getLastRow() > 1) {
      var sData = settingsSheet.getDataRange().getValues();
      for (var s = 1; s < sData.length; s++) {
        if (String(sData[s][0]).trim() === "EventCode" && sData[s][1]) {
          eventCode = String(sData[s][1]).trim();
          break;
        }
      }
    }

    // 2. Open or create "Registrations" tab
    var regSheet = ss.getSheetByName("Registrations");
    if (!regSheet) {
      regSheet = ss.insertSheet("Registrations");
      regSheet.appendRow(["ChestNumber", "Timestamp", "RegistrationData"]);
    }

    // Determine FCFS sequence number
    var lastRow = regSheet.getLastRow();
    var seqNum = lastRow <= 1 ? 1 : lastRow;
    var zeroPaddedSeq = ("000" + seqNum).slice(-3);
    if (seqNum > 999) {
      zeroPaddedSeq = String(seqNum);
    }
    var chestNumber = eventCode + zeroPaddedSeq;

    // Get order of keys from "Fields" tab
    var fieldsSheet = ss.getSheetByName("Fields");
    var fieldKeys = [];
    if (fieldsSheet && fieldsSheet.getLastRow() > 1) {
      var fData = fieldsSheet.getDataRange().getValues();
      for (var f = 1; f < fData.length; f++) {
        if (fData[f][0]) fieldKeys.push(String(fData[f][0]).trim());
      }
    }

    var newRow = [chestNumber, new Date()];

    if (fieldKeys.length > 0) {
      for (var k = 0; k < fieldKeys.length; k++) {
        var key = fieldKeys[k];
        newRow.push(payload[key] !== undefined ? payload[key] : "");
      }
    } else {
      for (var prop in payload) {
        newRow.push(payload[prop]);
      }
    }

    regSheet.appendRow(newRow);

    return createJsonResponse({
      success: true,
      chestNumber: chestNumber,
      message: "Registration successful!"
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
