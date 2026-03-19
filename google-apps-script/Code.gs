const CONFIG = {
  spreadsheetId: 'PASTE_YOUR_SPREADSHEET_ID_HERE',
  sheetName: 'Enquiries',
  notificationEmail: 'admissions@example.com',
  schoolName: 'Jaya Techno School - Hassan'
};

function doPost(e) {
  try {
    const data = sanitizePayload_(e.parameter || {});
    const sheet = getSheet_();

    ensureHeaderRow_(sheet);
    sheet.appendRow([
      new Date(),
      data.sourcePage,
      data.name,
      data.phone,
      data.email,
      data.classInterest,
      data.message
    ]);

    sendNotification_(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.sheetName) || spreadsheet.insertSheet(CONFIG.sheetName);
  return sheet;
}

function ensureHeaderRow_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Submitted At',
      'Source Page',
      'Name',
      'Phone',
      'Email',
      'Class Interested',
      'Message'
    ]);
  }
}

function sanitizePayload_(payload) {
  return {
    sourcePage: String(payload.source_page || ''),
    name: String(payload.name || '').trim(),
    phone: String(payload.phone || '').trim(),
    email: String(payload.email || '').trim(),
    classInterest: String(payload.class_interest || '').trim(),
    message: String(payload.message || '').trim()
  };
}

function sendNotification_(data) {
  if (!CONFIG.notificationEmail) {
    return;
  }

  const subject = 'New enquiry from ' + CONFIG.schoolName;
  const body = [
    'A new enquiry was received from the website.',
    '',
    'Source Page: ' + data.sourcePage,
    'Name: ' + data.name,
    'Phone: ' + data.phone,
    'Email: ' + data.email,
    'Class Interested: ' + data.classInterest,
    'Message: ' + data.message
  ].join('\n');

  MailApp.sendEmail(CONFIG.notificationEmail, subject, body);
}
